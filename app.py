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

"""Flask boundary for the secure local ADK travel planner."""

import os
import threading
import time
import uuid
from collections import defaultdict, deque
from pathlib import Path
from typing import Protocol

from dotenv import load_dotenv
from flask import Flask, Response, g, jsonify, render_template, request
from pydantic import ValidationError

import database
from trip_planner.logging_config import audit_event, configure_logging, correlation_id
from trip_planner.models import OrchestrationResponse, TripRequest
from trip_planner.security import safe_error
from trip_planner.service import OrchestrationService

load_dotenv(override=True)
AUDIT_LOGGER = configure_logging()


class OrchestrationServiceProtocol(Protocol):
    def orchestrate_sync(self, request: TripRequest, request_id: str) -> OrchestrationResponse: ...


class LocalRateLimiter:
    """Small bounded fixed-window limiter for the single-process local prototype."""

    def __init__(
        self,
        max_requests: int = 1,
        window_seconds: int = 60,
        max_clients: int = 1_000,
    ) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.max_clients = max_clients
        self._requests: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, client_id: str, *, now: float | None = None) -> bool:
        timestamp = time.monotonic() if now is None else now
        with self._lock:
            if client_id not in self._requests and len(self._requests) >= self.max_clients:
                oldest = min(self._requests, key=lambda key: self._requests[key][-1])
                del self._requests[oldest]
            entries = self._requests[client_id]
            cutoff = timestamp - self.window_seconds
            while entries and entries[0] <= cutoff:
                entries.popleft()
            if len(entries) >= self.max_requests:
                return False
            entries.append(timestamp)
            return True


def create_app(  # noqa: C901 - route registration is intentionally colocated
    *,
    orchestration_service: OrchestrationServiceProtocol | None = None,
    db_path: str | Path = database.DATABASE_PATH,
    rate_limiter: LocalRateLimiter | None = None,
) -> Flask:
    flask_app = Flask(__name__)
    service = orchestration_service or OrchestrationService()
    limiter = rate_limiter or LocalRateLimiter()
    database.init_db(db_path)

    @flask_app.before_request
    def start_request_context() -> None:
        g.request_id = request.headers.get("X-Request-ID") or f"req-{uuid.uuid4().hex}"
        g.correlation_token = correlation_id.set(g.request_id)

    @flask_app.after_request
    def finish_request_context(response: Response) -> Response:
        response.headers["X-Request-ID"] = g.request_id
        correlation_id.reset(g.correlation_token)
        return response

    def error_response(code: str, status: int):
        return (
            jsonify(
                success=False,
                request_id=g.request_id,
                error={"code": code, "message": _public_message(code)},
            ),
            status,
        )

    @flask_app.get("/")
    def index():
        google_maps_key = os.environ.get("PLACES_API_KEY") or os.environ.get("GOOGLE_PLACES_API_KEY") or os.environ.get("GEMINI_API_KEY") or ""
        return render_template("index.html", google_maps_key=google_maps_key)

    @flask_app.post("/api/orchestrate")
    def orchestrate():
        if not request.is_json:
            return error_response("JSON_REQUIRED", 415)
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error_response("INVALID_JSON", 400)
        try:
            trip_request = TripRequest.model_validate(payload)
        except ValidationError:
            audit_event(
                AUDIT_LOGGER,
                "request.validation_failed",
                component="flask",
                outcome="rejected",
                error_code="INVALID_TRIP_REQUEST",
            )
            return error_response("INVALID_TRIP_REQUEST", 400)

        client_id = request.remote_addr or "local"
        if not limiter.allow(client_id):
            audit_event(
                AUDIT_LOGGER,
                "request.rate_limited",
                component="flask",
                outcome="rejected",
            )
            return error_response("RATE_LIMITED", 429)

        try:
            result = service.orchestrate_sync(trip_request, g.request_id)
            trip_id = database.save_trip(
                title=result.title,
                trip_type=result.trip_type.value,
                input_data_dict=trip_request.model_dump(mode="json"),
                agent_logs_list=[item.model_dump(mode="json") for item in result.logs],
                result_data_dict=result.results.model_dump(mode="json"),
                db_path=db_path,
            )
            response = result.model_dump(mode="json")
            response.update({"success": True, "trip_id": trip_id})
            audit_event(AUDIT_LOGGER, "request.completed", component="flask", outcome="success")
            return jsonify(response)
        except RuntimeError as exc:
            code = str(exc)
            if code == "QUOTA_EXHAUSTED":
                audit_event(
                    AUDIT_LOGGER,
                    "request.failed",
                    component="flask",
                    outcome="failure",
                    error_code="QUOTA_EXHAUSTED",
                )
                return error_response("QUOTA_EXHAUSTED", 429)
            audit_event(
                AUDIT_LOGGER,
                "request.failed",
                component="flask",
                outcome="failure",
                error_code="ORCHESTRATION_FAILED",
            )
            return error_response("ORCHESTRATION_FAILED", 500)
        except Exception:
            audit_event(
                AUDIT_LOGGER,
                "request.failed",
                component="flask",
                outcome="failure",
                error_code="ORCHESTRATION_FAILED",
            )
            return error_response("ORCHESTRATION_FAILED", 500)

    @flask_app.get("/api/history")
    def get_history():
        try:
            return jsonify(
                success=True,
                request_id=g.request_id,
                history=database.get_trips_history(db_path=db_path),
            )
        except Exception:
            return error_response("HISTORY_UNAVAILABLE", 500)

    @flask_app.get("/api/trip/<int:trip_id>")
    def get_trip_details(trip_id: int):
        try:
            trip = database.get_trip(trip_id, db_path=db_path)
            if trip is None:
                return error_response("TRIP_NOT_FOUND", 404)
            return jsonify(success=True, request_id=g.request_id, trip=trip)
        except Exception:
            return error_response("TRIP_UNAVAILABLE", 500)

    @flask_app.delete("/api/trip/<int:trip_id>")
    def delete_trip_record(trip_id: int):
        try:
            deleted = database.delete_trip(trip_id, db_path=db_path)
            if not deleted:
                return error_response("TRIP_NOT_FOUND", 404)
            return jsonify(success=True, request_id=g.request_id)
        except Exception:
            return error_response("DELETE_FAILED", 500)

    @flask_app.post("/api/trip/<int:trip_id>/calculate")
    def calculate_trip_module(trip_id: int):
        if not request.is_json:
            return error_response("JSON_REQUIRED", 415)
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict) or "modules" not in payload:
            return error_response("INVALID_JSON", 400)

        modules_to_run = payload["modules"]
        if not isinstance(modules_to_run, list) or not all(isinstance(m, str) for m in modules_to_run):
            return error_response("INVALID_JSON", 400)

        try:
            trip = database.get_trip(trip_id, db_path=db_path)
            if trip is None:
                return error_response("TRIP_NOT_FOUND", 404)

            input_data = trip["input_data"]
            # Create a shallow copy and override selected_modules
            req_data = input_data.copy()
            req_data["selected_modules"] = modules_to_run

            trip_request = TripRequest.model_validate(req_data)
        except ValidationError:
            audit_event(
                AUDIT_LOGGER,
                "request.validation_failed",
                component="flask",
                outcome="rejected",
                error_code="INVALID_TRIP_REQUEST",
            )
            return error_response("INVALID_TRIP_REQUEST", 400)

        client_id = request.remote_addr or "local"
        if not limiter.allow(client_id):
            audit_event(
                AUDIT_LOGGER,
                "request.rate_limited",
                component="flask",
                outcome="rejected",
            )
            return error_response("RATE_LIMITED", 429)

        try:
            result = service.orchestrate_sync(trip_request, g.request_id)

            # Merge logic
            original_results = trip["result_data"]
            new_results = result.results.model_dump(mode="json")

            for key, value in new_results.items():
                if value is not None and key != "errors":
                    original_results[key] = value

            if "errors" in new_results and new_results["errors"]:
                original_results["errors"] = original_results.get("errors", []) + new_results["errors"]

            # Merge selected_modules in input_data
            original_selected = input_data.get("selected_modules", [])
            for mod in modules_to_run:
                if mod not in original_selected:
                    original_selected.append(mod)
            input_data["selected_modules"] = original_selected

            # Merge logs
            original_logs = trip["agent_logs"]
            new_logs = [item.model_dump(mode="json") for item in result.logs]
            original_logs.extend(new_logs)

            # Save to database
            database.update_trip(
                trip_id=trip_id,
                input_data_dict=input_data,
                agent_logs_list=original_logs,
                result_data_dict=original_results,
                db_path=db_path,
            )

            response = {
                "success": True,
                "trip_id": trip_id,
                "request_id": g.request_id,
                "title": trip["title"],
                "trip_type": trip["trip_type"],
                "logs": original_logs,
                "results": original_results
            }
            audit_event(AUDIT_LOGGER, "request.completed", component="flask", outcome="success")
            return jsonify(response)
        except RuntimeError as exc:
            code = str(exc)
            if code == "QUOTA_EXHAUSTED":
                audit_event(
                    AUDIT_LOGGER,
                    "request.failed",
                    component="flask",
                    outcome="failure",
                    error_code="QUOTA_EXHAUSTED",
                )
                return error_response("QUOTA_EXHAUSTED", 429)
            audit_event(
                AUDIT_LOGGER,
                "request.failed",
                component="flask",
                outcome="failure",
                error_code="ORCHESTRATION_FAILED",
            )
            return error_response("ORCHESTRATION_FAILED", 500)
        except Exception:
            audit_event(
                AUDIT_LOGGER,
                "request.failed",
                component="flask",
                outcome="failure",
                error_code="ORCHESTRATION_FAILED",
            )
            return error_response("ORCHESTRATION_FAILED", 500)

    @flask_app.get("/api/orchestrate/logs/<request_id>")
    def get_orchestration_logs(request_id: str):
        from trip_planner.logging_config import REALTIME_LOGS
        logs = REALTIME_LOGS.get(request_id, [])

        total_input_tokens = sum(item.get("input_tokens", 0) for item in logs)
        total_output_tokens = sum(item.get("output_tokens", 0) for item in logs)
        total_cost_usd = sum(item.get("cost_usd", 0.0) for item in logs)
        total_duration_ms = sum(item.get("duration_ms", 0) for item in logs if item.get("status") == "llm_call")

        return jsonify({
            "success": True,
            "logs": logs,
            "summary": {
                "total_input_tokens": total_input_tokens,
                "total_output_tokens": total_output_tokens,
                "total_cost_usd": total_cost_usd,
                "total_duration_ms": total_duration_ms
            }
        })

    return flask_app


def _public_message(code: str) -> str:
    messages = {
        "JSON_REQUIRED": "O corpo da solicitação deve ser JSON.",
        "INVALID_JSON": "O JSON enviado é inválido.",
        "INVALID_TRIP_REQUEST": "Os dados da viagem são inválidos.",
        "RATE_LIMITED": "Aguarde um minuto antes de gerar outro roteiro.",
        "QUOTA_EXHAUSTED": (
            "Limite temporário da API Gemini atingido. "
            "Aguarde pelo menos um minuto antes de tentar novamente."
        ),
        "TRIP_NOT_FOUND": "Viagem não encontrada.",
    }
    return messages.get(code, safe_error(RuntimeError(), code)["message"])


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=os.getenv("FLASK_DEBUG", "0") == "1",
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5001")),
    )
