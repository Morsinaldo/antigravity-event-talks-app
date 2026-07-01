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

from datetime import date

import pytest
from pydantic import ValidationError

from trip_planner.models import (
    MediaAsset,
    PackingCategory,
    PackingItem,
    Preference,
    RouteNode,
    TripRequest,
)


def valid_trip(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "origin": "Natal, RN",
        "destination": "Fortaleza, CE",
        "start_date": "2026-07-10",
        "end_date": "2026-07-17",
        "budget": "R$ 1.500",
        "dietary_restrictions": "Nenhuma",
        "preferences": ["historical", "nature"],
        "fridge_items": "sal, alho",
        "description": "Dirigir pelo litoral.",
    }
    payload.update(overrides)
    return payload


def test_trip_request_normalizes_and_types_valid_input() -> None:
    request = TripRequest.model_validate(valid_trip(destination="  Fortaleza, CE  "))

    assert request.destination == "Fortaleza, CE"
    assert request.start_date == date(2026, 7, 10)
    assert request.preferences == [Preference.HISTORICAL, Preference.NATURE]


def test_trip_request_rejects_unknown_fields() -> None:
    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        TripRequest.model_validate(valid_trip(admin=True))


def test_trip_request_rejects_reversed_dates() -> None:
    with pytest.raises(ValidationError, match="end_date must be on or after start_date"):
        TripRequest.model_validate(valid_trip(start_date="2026-07-17", end_date="2026-07-10"))


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("destination", ""),
        ("destination", "x" * 121),
        ("description", "x" * 2001),
        ("preferences", ["nature"] * 9),
        ("preferences", ["unknown"]),
    ],
)
def test_trip_request_rejects_invalid_limits(field: str, value: object) -> None:
    with pytest.raises(ValidationError):
        TripRequest.model_validate(valid_trip(**{field: value}))


@pytest.mark.parametrize(
    ("lat", "lng"),
    [(91, 0), (-91, 0), (0, 181), (0, -181)],
)
def test_route_node_rejects_invalid_coordinates(lat: float, lng: float) -> None:
    with pytest.raises(ValidationError):
        RouteNode(name="Ponto", lat=lat, lng=lng, description="Descrição")


def test_media_asset_accepts_only_allowlisted_https_urls() -> None:
    asset = MediaAsset(
        url="https://upload.wikimedia.org/example.jpg",
        source_url="https://commons.wikimedia.org/wiki/File:Example.jpg",
        attribution="Example / CC BY-SA 4.0",
        alt="Praia em Fortaleza",
        query="Fortaleza beach",
    )

    assert asset.url.host == "upload.wikimedia.org"

    with pytest.raises(ValidationError, match="allowlisted"):
        MediaAsset(
            url="https://evil.example/image.jpg",
            source_url="https://commons.wikimedia.org/wiki/File:Example.jpg",
            attribution="Unknown",
            alt="Imagem",
            query="query",
        )


def test_packing_item_is_structured() -> None:
    item = PackingItem(
        name="Capa de chuva",
        category="rain_gear",
        reason="Previsão de chuva",
        quantity=1,
        media_query="light rain jacket clothing",
    )

    assert item.category is PackingCategory.RAIN_GEAR
    assert item.quantity == 1
