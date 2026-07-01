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

import json

import pytest

from trip_planner.models import TripRequest
from trip_planner.service import OrchestrationService


@pytest.mark.asyncio
async def test_service_validates_adk_state_and_returns_response() -> None:
    async def fake_executor(_request: TripRequest, _request_id: str) -> dict[str, object]:
        return {
            "plan": json.dumps(
                {
                    "title": "Rota do Sol",
                    "trip_type": "roadtrip",
                    "agents_to_run": ["location", "weather"],
                }
            ),
            "final_result": json.dumps({"errors": []}),
            "audit_logs": [
                {
                    "agent": "Orchestrator Agent",
                    "status": "completed",
                    "message": "Plano validado.",
                    "duration_ms": 12,
                }
            ],
        }

    service = OrchestrationService(executor=fake_executor)
    response = await service.orchestrate(TripRequest(destination="Fortaleza"), "req-12345678")

    assert response.request_id == "req-12345678"
    assert response.title == "Rota do Sol"
    assert response.trip_type == "roadtrip"
    assert response.logs[0].duration_ms == 12


@pytest.mark.asyncio
async def test_service_does_not_leak_executor_exception() -> None:
    async def failing_executor(_request: TripRequest, _request_id: str) -> dict[str, object]:
        raise RuntimeError("secret API key /Users/alice/.env")

    service = OrchestrationService(executor=failing_executor)

    with pytest.raises(RuntimeError, match=r"^ORCHESTRATION_FAILED$") as captured:
        await service.orchestrate(TripRequest(destination="Fortaleza"), "req-12345678")

    assert "secret" not in str(captured.value)


@pytest.mark.asyncio
async def test_service_maps_nested_resource_exhausted_to_quota_error() -> None:
    async def failing_executor(_request: TripRequest, _request_id: str) -> dict[str, object]:
        raise ExceptionGroup(
            "parallel agent failed",
            [RuntimeError("429 RESOURCE_EXHAUSTED")],
        )

    service = OrchestrationService(executor=failing_executor)

    with pytest.raises(RuntimeError, match=r"^QUOTA_EXHAUSTED$"):
        await service.orchestrate(TripRequest(destination="Fortaleza"), "req-12345678")
