# Copyright (c) 2026 MyCompany LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Typed adapter between Flask and the ADK execution runtime."""

import asyncio
import json
import time
from collections.abc import Awaitable, Callable, Iterator
from typing import TypeVar

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from pydantic import BaseModel

from trip_planner.agent import app
from trip_planner.logging_config import audit_event, configure_logging, correlation_id
from trip_planner.models import (
    AgentLog,
    OrchestrationResponse,
    OrchestratorPlan,
    TripRequest,
    TripResult,
)

StateExecutor = Callable[[TripRequest, str], Awaitable[dict[str, object]]]
ModelT = TypeVar("ModelT", bound=BaseModel)
AUDIT_LOGGER = configure_logging()


def _decode_model(value: object, model: type[ModelT]) -> ModelT:
    if isinstance(value, model):
        return value
    if isinstance(value, str):
        return model.model_validate(json.loads(value))
    return model.model_validate(value)


def _exception_chain(exc: BaseException) -> Iterator[BaseException]:
    yield exc
    if isinstance(exc, BaseExceptionGroup):
        for nested in exc.exceptions:
            yield from _exception_chain(nested)
    if exc.__cause__ is not None:
        yield from _exception_chain(exc.__cause__)
    elif exc.__context__ is not None:
        yield from _exception_chain(exc.__context__)


def _is_quota_error(exc: BaseException) -> bool:
    return any(
        "429" in str(candidate)
        or "RESOURCE_EXHAUSTED" in str(candidate)
        or "ResourceExhausted" in type(candidate).__name__
        or "_ResourceExhaustedError" in type(candidate).__name__
        for candidate in _exception_chain(exc)
    )


class OrchestrationService:
    """Run the ADK graph and validate everything crossing back into Flask."""

    def __init__(self, executor: StateExecutor | None = None) -> None:
        self._executor = executor or self._execute_adk

    async def orchestrate(self, request: TripRequest, request_id: str) -> OrchestrationResponse:
        token = correlation_id.set(request_id)
        started = time.monotonic()
        audit_event(AUDIT_LOGGER, "orchestration.started", component="service")
        try:
            state = await self._executor(request, request_id)
            plan = _decode_model(state.get("plan"), OrchestratorPlan)
            result = _decode_model(state.get("final_result"), TripResult)
            raw_logs = state.get("audit_logs", [])
            logs = [AgentLog.model_validate(item) for item in raw_logs]
            response = OrchestrationResponse(
                request_id=request_id,
                title=plan.title,
                trip_type=plan.trip_type,
                logs=logs,
                results=result,
            )
            audit_event(
                AUDIT_LOGGER,
                "orchestration.completed",
                component="service",
                duration_ms=round((time.monotonic() - started) * 1_000),
                outcome="success",
            )
            return response
        except Exception as exc:
            import traceback
            traceback.print_exc()
            error_code = "QUOTA_EXHAUSTED" if _is_quota_error(exc) else "ORCHESTRATION_FAILED"
            audit_event(
                AUDIT_LOGGER,
                "orchestration.failed",
                component="service",
                duration_ms=round((time.monotonic() - started) * 1_000),
                outcome="failure",
                error_code=error_code,
            )
            raise RuntimeError(error_code) from exc
        finally:
            correlation_id.reset(token)

    async def _execute_adk(self, request: TripRequest, request_id: str) -> dict[str, object]:
        from google.adk.agents import SequentialAgent, ParallelAgent
        from google.adk.apps import App
        from trip_planner.agent import (
            coordinator,
            location_agent,
            weather_agent,
            logistics_agent,
            cuisine_agent,
            events_agent,
            weather_formatter,
            media_agent,
            aggregator,
            app as adk_app
        )

        # Clear parent agent references to avoid Pydantic validator issues in ADK
        for agent in [
            coordinator,
            location_agent,
            weather_agent,
            logistics_agent,
            cuisine_agent,
            events_agent,
            weather_formatter,
            media_agent,
            aggregator
        ]:
            agent.parent_agent = None

        selected = request.selected_modules or ["road_trip", "lodging", "cuisine", "agenda"]
        active_specialists = []
        need_weather = "lodging" in selected

        if "road_trip" in selected:
            active_specialists.append(location_agent)
        if need_weather:
            active_specialists.append(weather_agent)
        if "lodging" in selected:
            active_specialists.append(logistics_agent)
        if "cuisine" in selected:
            active_specialists.append(cuisine_agent)
        if "agenda" in selected:
            active_specialists.append(events_agent)

        if not active_specialists:
            active_specialists = [location_agent, weather_agent, logistics_agent, cuisine_agent, events_agent]
            selected = ["road_trip", "lodging", "cuisine", "agenda"]
            need_weather = True

        dynamic_specialists = ParallelAgent(
            name="travel_specialists",
            description="Runs independent travel-planning specialists concurrently.",
            sub_agents=active_specialists,
        )

        dynamic_seq_agents = [coordinator, dynamic_specialists]
        if need_weather:
            dynamic_seq_agents.append(weather_formatter)
        if any(m in selected for m in ["road_trip", "lodging", "agenda"]):
            dynamic_seq_agents.append(media_agent)
        dynamic_seq_agents.append(aggregator)

        dynamic_root_agent = SequentialAgent(
            name="secure_travel_planner",
            description="Coordinates secure, grounded travel planning.",
            sub_agents=dynamic_seq_agents,
        )

        dynamic_app = App(name=adk_app.name, root_agent=dynamic_root_agent)

        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name=dynamic_app.name,
            user_id="local-user",
            session_id=request_id,
            state={"trip_request": request.model_dump_json()},
        )
        runner = Runner(app=dynamic_app, session_service=session_service)
        completed_agents: list[str] = []
        started = time.monotonic()
        try:
            message = types.Content(
                role="user",
                parts=[types.Part.from_text(text=request.model_dump_json())],
            )
            from trip_planner.logging_config import add_realtime_log, REALTIME_LOGS

            add_realtime_log(request_id, "coordinator", "thinking", "Iniciando orquestrador e processando preferências de viagem...")

            async for event in runner.run_async(
                user_id="local-user", session_id=session.id, new_message=message
            ):
                agent_name = event.author
                is_final = event.is_final_response()

                status = "completed" if is_final else "thinking"
                msg = f"Agente {agent_name} concluiu sua etapa." if is_final else f"Agente {agent_name} está processando..."
                add_realtime_log(request_id, agent_name, status, msg)

                if is_final and agent_name not in completed_agents:
                    completed_agents.append(agent_name)

            updated = await session_service.get_session(
                app_name=dynamic_app.name, user_id="local-user", session_id=session.id
            )
            if updated is None:
                raise RuntimeError("session_not_found")
            state: dict[str, object] = dict(updated.state)
            duration_ms = round((time.monotonic() - started) * 1_000)

            # Accumulate LLM metrics per agent from real-time logs
            rt_logs = REALTIME_LOGS.get(request_id, [])
            agent_metrics = {}
            for entry in rt_logs:
                if entry.get("status") == "llm_call":
                    a_name = entry.get("agent", "unknown")
                    metrics = agent_metrics.setdefault(a_name, {
                        "input_tokens": 0,
                        "output_tokens": 0,
                        "cost_usd": 0.0,
                        "duration_ms": 0
                    })
                    metrics["input_tokens"] += entry.get("input_tokens", 0)
                    metrics["output_tokens"] += entry.get("output_tokens", 0)
                    metrics["cost_usd"] += entry.get("cost_usd", 0.0)
                    metrics["duration_ms"] += entry.get("duration_ms", 0)

            state["audit_logs"] = [
                AgentLog(
                    agent=agent_name,
                    status="completed",
                    message="Etapa concluída e validada.",
                    duration_ms=agent_metrics.get(agent_name, {}).get("duration_ms") or (duration_ms if index == len(completed_agents) - 1 else None),
                    input_tokens=agent_metrics.get(agent_name, {}).get("input_tokens"),
                    output_tokens=agent_metrics.get(agent_name, {}).get("output_tokens"),
                    cost_usd=agent_metrics.get(agent_name, {}).get("cost_usd"),
                ).model_dump(mode="json")
                for index, agent_name in enumerate(completed_agents)
            ]
            return state
        finally:
            await runner.close()

    def orchestrate_sync(self, request: TripRequest, request_id: str) -> OrchestrationResponse:
        """Synchronous adapter for the existing Flask request lifecycle."""

        return asyncio.run(self.orchestrate(request, request_id))
