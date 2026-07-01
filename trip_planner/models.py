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

"""Strict data contracts shared by HTTP, agents, MCP tools, and persistence."""

from datetime import date
from enum import StrEnum
from typing import Annotated, Any

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator, model_validator

ShortText = Annotated[str, Field(min_length=1, max_length=120)]
Description = Annotated[str, Field(min_length=1, max_length=2_000)]
Latitude = Annotated[float, Field(ge=-90, le=90)]
Longitude = Annotated[float, Field(ge=-180, le=180)]


class StrictModel(BaseModel):
    """Reject unknown data and normalize whitespace at every trust boundary."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Preference(StrEnum):
    HISTORICAL = "historical"
    NATURE = "nature"
    MUSEUMS = "museums"
    FESTIVE = "festive"
    ADVENTURE = "adventure"
    SHOPPING = "shopping"


class TripType(StrEnum):
    GASTRONOMY = "gastronomy"
    ROADTRIP = "roadtrip"
    BUSINESS = "business"
    CUSTOM = "custom"


class SectionStatus(StrEnum):
    COMPLETED = "completed"
    UNAVAILABLE = "unavailable"


class PackingCategory(StrEnum):
    TOP = "top"
    BOTTOM = "bottom"
    OUTERWEAR = "outerwear"
    RAIN_GEAR = "rain_gear"
    FOOTWEAR = "footwear"
    SWIMWEAR = "swimwear"
    ACCESSORY = "accessory"
    LUGGAGE = "luggage"
    DOCUMENT = "document"
    OTHER = "other"


class TripRequest(StrictModel):
    # Origin is optional: if omitted or empty, defaults to "Localização Atual"
    origin: str = Field(default="Localização Atual", max_length=120)
    # Destination is the only truly required field
    destination: str = Field(min_length=1, max_length=120)
    start_date: date | None = None
    end_date: date | None = None
    # Optional fields: empty string is treated as None / default value
    budget: str | None = Field(default=None, max_length=120)
    dietary_restrictions: str | None = Field(default=None, max_length=500)
    preferences: list[Preference] = Field(default_factory=list, max_length=8)
    fridge_items: str | None = Field(default=None, max_length=500)
    description: str = Field(default="", max_length=2_000)
    # Scheduling constraints for daily agenda (e.g. "Only available after 18h")
    available_hours: str = Field(default="Dia todo", max_length=300)
    selected_modules: list[str] = Field(
        default_factory=lambda: ["road_trip", "lodging", "cuisine", "agenda"]
    )

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def empty_date_is_none(cls, value: Any) -> Any:
        return None if value in ("", None) else value

    @field_validator("budget", "dietary_restrictions", "fridge_items", mode="before")
    @classmethod
    def empty_string_is_none(cls, value: Any) -> Any:
        """Treat empty or whitespace-only strings as None for optional text fields."""
        if value is None:
            return None
        stripped = str(value).strip()
        return None if stripped == "" else stripped

    @field_validator("origin", mode="before")
    @classmethod
    def empty_origin_is_default(cls, value: Any) -> Any:
        """Treat empty origin as the default placeholder."""
        if value is None:
            return "Localização Atual"
        stripped = str(value).strip()
        return "Localização Atual" if stripped == "" else stripped

    @model_validator(mode="after")
    def dates_are_ordered(self) -> "TripRequest":
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class MediaAsset(StrictModel):
    url: HttpUrl
    source_url: HttpUrl
    attribution: str = Field(min_length=1, max_length=500)
    alt: str = Field(min_length=1, max_length=300)
    query: str = Field(min_length=1, max_length=200)

    @field_validator("url")
    @classmethod
    def image_url_is_allowlisted(cls, value: HttpUrl) -> HttpUrl:
        if value.scheme != "https" or value.host not in {
            "upload.wikimedia.org",
            "commons.wikimedia.org",
        }:
            raise ValueError("image URL must use an allowlisted Wikimedia host")
        return value

    @field_validator("source_url")
    @classmethod
    def source_url_is_allowlisted(cls, value: HttpUrl) -> HttpUrl:
        if value.scheme != "https" or value.host != "commons.wikimedia.org":
            raise ValueError("source URL must use the allowlisted Commons host")
        return value


class RouteNode(StrictModel):
    name: ShortText
    lat: Latitude
    lng: Longitude
    description: Description
    media: MediaAsset | None = None


class LocationAgentOutput(StrictModel):
    distance_km: str = Field(min_length=1, max_length=80)
    estimated_duration: str = Field(min_length=1, max_length=80)
    route_nodes: list[RouteNode] = Field(min_length=1, max_length=20)
    map_center: RouteNode
    sources: list[str] = Field(default_factory=list, max_length=15)


class DayForecast(StrictModel):
    day: ShortText
    temp: str = Field(min_length=1, max_length=80)
    condition: str = Field(min_length=1, max_length=200)
    precipitation_probability: int | None = Field(default=None, ge=0, le=100)


class PackingItem(StrictModel):
    name: ShortText
    category: PackingCategory
    reason: str = Field(min_length=1, max_length=300)
    quantity: int = Field(default=1, ge=1, le=20)
    media_query: str = Field(min_length=1, max_length=200)
    media: MediaAsset | None = None


class WeatherAgentOutput(StrictModel):
    forecast: list[DayForecast] = Field(min_length=1, max_length=16)
    clothing_suggestions: str = Field(min_length=1, max_length=2_000)
    packing_checklist: list[PackingItem] = Field(min_length=1, max_length=40)
    sources: list[str] = Field(default_factory=list, max_length=15)


class LodgingSuggestion(StrictModel):
    name: ShortText
    price_range: str = Field(min_length=1, max_length=120)
    rating: str = Field(min_length=1, max_length=40)
    description: Description
    lat: Latitude
    lng: Longitude
    amenities: list[ShortText] = Field(default_factory=list, max_length=12)
    room_types: list[ShortText] = Field(default_factory=list, max_length=8)
    media: MediaAsset | None = None
    url: str | None = Field(default=None, max_length=300)


class TransitOption(StrictModel):
    type: ShortText
    details: Description
    estimated_cost: str = Field(min_length=1, max_length=120)


class LogisticsAgentOutput(StrictModel):
    lodging_suggestions: list[LodgingSuggestion] = Field(default_factory=list, max_length=3)
    transit_options: list[TransitOption] = Field(default_factory=list, max_length=8)
    sources: list[str] = Field(default_factory=list, max_length=15)


class MenuItem(StrictModel):
    name: ShortText
    price: str = Field(min_length=1, max_length=80)
    description: Description


class TypicalDish(StrictModel):
    name: ShortText
    description: Description
    history: Description
    ingredients: list[ShortText] = Field(default_factory=list, max_length=10)
    recipe_steps: list[Description] = Field(default_factory=list, max_length=8)
    dietary_tags: list[ShortText] = Field(default_factory=list, max_length=12)
    media: MediaAsset | None = None

    @field_validator("ingredients", "recipe_steps", "dietary_tags", mode="before")
    @classmethod
    def filter_empty_items(cls, value: Any) -> Any:
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip() != ""]
        return value


class RankedRestaurant(StrictModel):
    name: ShortText
    cuisine_type: ShortText
    rating: str = Field(min_length=1, max_length=40)
    price_tier: str = Field(min_length=1, max_length=40)
    description: Description
    lat: Latitude
    lng: Longitude
    menu: list[MenuItem] = Field(default_factory=list, max_length=3)
    url: str | None = Field(default=None, max_length=300)


class CuisineAgentOutput(StrictModel):
    typical_dishes: list[TypicalDish] = Field(default_factory=list, max_length=3)
    restaurant_ranking: list[RankedRestaurant] = Field(default_factory=list, max_length=3)
    shopping_list: list[ShortText] = Field(default_factory=list, max_length=50)
    estimated_shopping_cost: str = Field(min_length=1, max_length=120)
    sources: list[str] = Field(default_factory=list, max_length=15)

    @field_validator("shopping_list", mode="before")
    @classmethod
    def filter_empty_shopping_list(cls, value: Any) -> Any:
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip() != ""]
        return value


class SightseeingSpot(StrictModel):
    name: ShortText
    type: ShortText
    description: Description
    lat: Latitude
    lng: Longitude
    best_time: str = Field(min_length=1, max_length=120)
    estimated_cost: str = Field(min_length=1, max_length=120)
    media: MediaAsset | None = None
    url: str | None = Field(default=None, max_length=300)


class LocalEvent(StrictModel):
    name: ShortText
    date: str = Field(min_length=1, max_length=120)
    description: Description
    lat: Latitude
    lng: Longitude
    venue: ShortText
    media: MediaAsset | None = None
    url: str | None = Field(default=None, max_length=300)


class DayAgenda(StrictModel):
    day: ShortText
    activities: list[Description] = Field(default_factory=list, max_length=20)

    @field_validator("activities", mode="before")
    @classmethod
    def filter_empty_activities(cls, value: Any) -> Any:
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip() != ""]
        return value


class EventsAgentOutput(StrictModel):
    sightseeing: list[SightseeingSpot] = Field(default_factory=list, max_length=3)
    events: list[LocalEvent] = Field(default_factory=list, max_length=3)
    daily_agenda: list[DayAgenda] = Field(default_factory=list, max_length=16)
    travel_checklist: list[ShortText] = Field(default_factory=list, max_length=40)
    sources: list[str] = Field(default_factory=list, max_length=15)

    @field_validator("travel_checklist", mode="before")
    @classmethod
    def filter_empty_checklist(cls, value: Any) -> Any:
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip() != ""]
        return value


class OrchestratorPlan(StrictModel):
    title: str = Field(min_length=1, max_length=160)
    trip_type: TripType
    agents_to_run: list[str] = Field(min_length=1, max_length=5)


class SectionError(StrictModel):
    section: str = Field(min_length=1, max_length=40)
    code: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=300)


class TripResult(StrictModel):
    location: LocationAgentOutput | None = None
    weather: WeatherAgentOutput | None = None
    logistics: LogisticsAgentOutput | None = None
    cuisine: CuisineAgentOutput | None = None
    events: EventsAgentOutput | None = None
    errors: list[SectionError] = Field(default_factory=list, max_length=5)


class AgentLog(StrictModel):
    agent: str = Field(min_length=1, max_length=100)
    status: SectionStatus
    message: str = Field(min_length=1, max_length=500)
    duration_ms: int | None = Field(default=None, ge=0)
    input_tokens: int | None = Field(default=None, ge=0)
    output_tokens: int | None = Field(default=None, ge=0)
    cost_usd: float | None = Field(default=None, ge=0.0)


class OrchestrationResponse(StrictModel):
    request_id: str = Field(min_length=8, max_length=64)
    title: str = Field(min_length=1, max_length=160)
    trip_type: TripType
    logs: list[AgentLog] = Field(default_factory=list, max_length=50)
    results: TripResult
