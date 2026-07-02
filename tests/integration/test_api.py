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

from app import LocalRateLimiter, create_app
from trip_planner.models import OrchestrationResponse, TripRequest


class FakeService:
    def orchestrate_sync(self, request: TripRequest, request_id: str) -> OrchestrationResponse:
        results = {"errors": []}
        if "cuisine" in request.selected_modules:
            results["cuisine"] = {
                "typical_dishes": [],
                "restaurant_ranking": [],
                "shopping_list": ["Sal"],
                "estimated_shopping_cost": "R$ 5",
                "sources": []
            }
        if "road_trip" in request.selected_modules:
            results["location"] = {
                "distance_km": "100 km",
                "estimated_duration": "2h",
                "route_nodes": [
                    {
                        "name": "Ponto A",
                        "lat": 0.0,
                        "lng": 0.0,
                        "description": "Primeiro Ponto"
                    }
                ],
                "map_center": {
                    "name": "Centro",
                    "lat": 0.0,
                    "lng": 0.0,
                    "description": "Centro"
                },
                "sources": []
            }
        return OrchestrationResponse(
            request_id=request_id,
            title=f"Viagem para {request.destination}",
            trip_type="custom",
            logs=[],
            results=results,
        )


class FailingService:
    def orchestrate_sync(self, request: TripRequest, request_id: str) -> OrchestrationResponse:
        raise RuntimeError("secret /Users/alice/.env")


class QuotaService:
    def orchestrate_sync(self, request: TripRequest, request_id: str) -> OrchestrationResponse:
        raise RuntimeError("QUOTA_EXHAUSTED")


def make_client(tmp_path, service=None, limiter=None):
    app = create_app(
        orchestration_service=service or FakeService(),
        db_path=tmp_path / "api.db",
        rate_limiter=limiter,
    )
    app.config.update(TESTING=True)
    return app.test_client()


def test_orchestrate_rejects_non_json_and_invalid_payload(tmp_path) -> None:
    client = make_client(tmp_path)

    non_json = client.post("/api/orchestrate", data="destination=Fortaleza")
    invalid = client.post("/api/orchestrate", json={"destination": "", "admin": True})

    assert non_json.status_code == 415
    assert invalid.status_code == 400
    assert invalid.json["error"]["code"] == "INVALID_TRIP_REQUEST"
    assert "request_id" in invalid.json
    assert client.post("/api/orchestrate", json={"destination": "Fortaleza"}).status_code == 200


def test_orchestrate_returns_correlation_and_persists_valid_result(tmp_path) -> None:
    client = make_client(tmp_path)

    response = client.post("/api/orchestrate", json={"destination": "Fortaleza"})

    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.headers["X-Request-ID"] == response.json["request_id"]
    history = client.get("/api/history")
    assert history.json["history"][0]["title"] == "Viagem para Fortaleza"


def test_orchestrate_hides_internal_exception(tmp_path) -> None:
    client = make_client(tmp_path, service=FailingService())

    response = client.post("/api/orchestrate", json={"destination": "Fortaleza"})

    assert response.status_code == 500
    serialized = response.get_data(as_text=True)
    assert "secret" not in serialized
    assert "/Users/" not in serialized
    assert response.json["error"]["code"] == "ORCHESTRATION_FAILED"


def test_orchestrate_has_bounded_local_rate_limit(tmp_path) -> None:
    limiter = LocalRateLimiter(max_requests=1, window_seconds=60)
    client = make_client(tmp_path, limiter=limiter)

    assert client.post("/api/orchestrate", json={"destination": "Fortaleza"}).status_code == 200
    limited = client.post("/api/orchestrate", json={"destination": "Fortaleza"})

    assert limited.status_code == 429
    assert limited.json["error"]["code"] == "RATE_LIMITED"


def test_default_orchestration_limit_is_one_request_per_minute(tmp_path) -> None:
    client = make_client(tmp_path)

    assert client.post("/api/orchestrate", json={"destination": "Fortaleza"}).status_code == 200
    response = client.post("/api/orchestrate", json={"destination": "Natal"})

    assert response.status_code == 429
    assert response.json["error"]["code"] == "RATE_LIMITED"


def test_quota_error_returns_json_429_with_request_id(tmp_path) -> None:
    client = make_client(tmp_path, service=QuotaService())

    response = client.post("/api/orchestrate", json={"destination": "Fortaleza"})

    assert response.status_code == 429
    assert response.json["error"]["code"] == "QUOTA_EXHAUSTED"
    assert response.json["request_id"] == response.headers["X-Request-ID"]

