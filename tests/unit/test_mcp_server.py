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

import httpx
import pytest
from pydantic import ValidationError

from trip_planner.mcp_server import (
    MediaSearchInput,
    WeatherToolInput,
    fetch_destination_weather,
    search_commons_media_data,
)


def test_tool_inputs_are_strict_and_bounded() -> None:
    with pytest.raises(ValidationError):
        WeatherToolInput(destination="Fortaleza", unexpected=True)
    with pytest.raises(ValidationError):
        WeatherToolInput(destination="x" * 121)
    with pytest.raises(ValidationError):
        MediaSearchInput(query="praia", max_results=4)


@pytest.mark.asyncio
async def test_weather_tool_geocodes_and_normalizes_forecast() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.host == "geocoding-api.open-meteo.com":
            assert request.url.params["name"] == "Fortaleza"
            return httpx.Response(
                200,
                json={"results": [{"name": "Fortaleza", "latitude": -3.73, "longitude": -38.52}]},
            )
        assert request.url.host == "api.open-meteo.com"
        return httpx.Response(
            200,
            json={
                "daily": {
                    "time": ["2026-07-10"],
                    "temperature_2m_max": [30.0],
                    "temperature_2m_min": [24.0],
                    "precipitation_probability_max": [35],
                    "weather_code": [2],
                }
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        result = await fetch_destination_weather(
            WeatherToolInput(
                destination="Fortaleza",
                start_date="2026-07-10",
                end_date="2026-07-10",
            ),
            client=client,
        )

    assert result.status == "ok"
    assert result.location == "Fortaleza"
    assert result.days[0].temperature_max_c == 30.0
    assert result.days[0].weather_code == 2


@pytest.mark.asyncio
async def test_weather_tool_returns_typed_unavailable_on_no_geocode() -> None:
    transport = httpx.MockTransport(lambda _request: httpx.Response(200, json={"results": []}))
    async with httpx.AsyncClient(transport=transport) as client:
        result = await fetch_destination_weather(
            WeatherToolInput(destination="Lugar inexistente"), client=client
        )

    assert result.model_dump() == {
        "status": "unavailable",
        "location": None,
        "latitude": None,
        "longitude": None,
        "days": [],
        "reason": "location_not_found",
    }


@pytest.mark.asyncio
async def test_media_tool_keeps_source_and_attribution() -> None:
    response = {
        "query": {
            "pages": {
                "42": {
                    "title": "File:Praia de Iracema.jpg",
                    "imageinfo": [
                        {
                            "thumburl": "https://upload.wikimedia.org/example.jpg",
                            "descriptionurl": "https://commons.wikimedia.org/wiki/File:Praia_de_Iracema.jpg",
                            "extmetadata": {
                                "Artist": {"value": "Fotógrafo Exemplo"},
                                "LicenseShortName": {"value": "CC BY-SA 4.0"},
                                "ImageDescription": {"value": "Praia de Iracema, Fortaleza"},
                            },
                        }
                    ],
                }
            }
        }
    }
    transport = httpx.MockTransport(lambda _request: httpx.Response(200, json=response))
    async with httpx.AsyncClient(transport=transport) as client:
        result = await search_commons_media_data(
            MediaSearchInput(query="Praia de Iracema Fortaleza", max_results=1), client=client
        )

    assert result.status == "ok"
    assert result.assets[0].attribution == "Fotógrafo Exemplo / CC BY-SA 4.0"
    assert result.assets[0].source_url.host == "commons.wikimedia.org"
    assert result.assets[0].query == "Praia de Iracema Fortaleza"


@pytest.mark.asyncio
async def test_media_tool_rejects_non_allowlisted_image_url() -> None:
    response = {
        "query": {
            "pages": {
                "1": {
                    "title": "File:Bad.jpg",
                    "imageinfo": [
                        {
                            "thumburl": "https://evil.example/bad.jpg",
                            "descriptionurl": "https://commons.wikimedia.org/wiki/File:Bad.jpg",
                            "extmetadata": {},
                        }
                    ],
                }
            }
        }
    }
    transport = httpx.MockTransport(lambda _request: httpx.Response(200, json=response))
    async with httpx.AsyncClient(transport=transport) as client:
        result = await search_commons_media_data(
            MediaSearchInput(query="Bad image", max_results=1), client=client
        )

    assert result.status == "unavailable"
    assert result.reason == "no_allowlisted_media"
