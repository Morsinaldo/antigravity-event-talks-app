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

from types import SimpleNamespace

import pytest
from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from google.adk.tools.mcp_tool import McpToolset

from trip_planner.agent import _adk_schema, _before_tool, app, root_agent
from trip_planner.models import OrchestratorPlan, TripResult


def test_adk_schema_removes_unsupported_additional_properties_recursively() -> None:
    schema_text = repr(_adk_schema(TripResult))

    for unsupported in [
        "additionalProperties",
        "additional_properties",
        "maxItems",
        "maxLength",
        "maximum",
        "minItems",
        "minLength",
        "minimum",
        "format",
    ]:
        assert unsupported not in schema_text

    plan_schema = _adk_schema(OrchestratorPlan)
    assert "title" in plan_schema["properties"]
    assert set(plan_schema["required"]).issubset(plan_schema["properties"])


def test_root_is_real_adk_sequential_workflow() -> None:
    assert app.name == "trip_planner"
    assert app.root_agent is root_agent
    assert isinstance(root_agent, SequentialAgent)
    assert [agent.name for agent in root_agent.sub_agents] == [
        "trip_coordinator",
        "travel_specialists",
        "weather_formatter",
        "media_enrichment_agent",
        "result_aggregator",
    ]


def test_specialists_run_through_parallel_agent() -> None:
    parallel = root_agent.sub_agents[1]

    assert isinstance(parallel, ParallelAgent)
    assert {agent.name for agent in parallel.sub_agents} == {
        "location_agent",
        "weather_agent",
        "logistics_agent",
        "cuisine_agent",
        "events_agent",
    }
    assert all(isinstance(agent, LlmAgent) for agent in parallel.sub_agents)


def test_agents_are_split_across_free_tier_model_quotas() -> None:
    parallel = root_agent.sub_agents[1]

    assert {agent.model.model for agent in parallel.sub_agents} == {"gemini-3.1-flash-lite"}
    assert root_agent.sub_agents[2].model.model == "gemini-3.1-flash-lite"
    assert root_agent.sub_agents[0].model.model == "gemini-2.5-flash"
    assert root_agent.sub_agents[3].model.model == "gemini-2.5-flash"
    assert root_agent.sub_agents[4].model.model == "gemini-2.5-flash"


def test_only_grounded_agents_receive_mcp_tools() -> None:
    parallel = root_agent.sub_agents[1]
    specialists = {agent.name: agent for agent in parallel.sub_agents}
    media = root_agent.sub_agents[3]

    assert any(isinstance(tool, McpToolset) for tool in specialists["weather_agent"].tools)
    assert any(isinstance(tool, McpToolset) for tool in media.tools)
    # Todos os agentes especialistas agora possuem ferramentas MCP de busca ou clima
    for name, agent in specialists.items():
        assert any(isinstance(tool, McpToolset) for tool in agent.tools)
    tool_text = repr(root_agent).casefold()
    assert "run_command" not in tool_text
    assert "shell" not in tool_text


@pytest.mark.asyncio
async def test_media_agent_blocks_searches_after_three_calls() -> None:
    tool = SimpleNamespace(name="search_commons_media")
    context = SimpleNamespace(state={})

    for _ in range(3):
        assert await _before_tool(tool, {}, context) is None

    blocked = await _before_tool(tool, {}, context)

    assert blocked == {
        "status": "unavailable",
        "assets": [],
        "reason": "media_search_limit_reached",
    }


def test_structured_agents_have_distinct_output_keys() -> None:
    output_keys = {
        agent.output_key
        for agent in root_agent.sub_agents
        if isinstance(agent, LlmAgent) and agent.output_key
    }
    parallel = root_agent.sub_agents[1]
    output_keys.update(agent.output_key for agent in parallel.sub_agents)

    assert {
        "plan",
        "location_result",
        "weather_grounding",
        "logistics_result",
        "cuisine_result",
        "events_result",
        "weather_result",
        "media_grounding",
        "final_result",
    }.issubset(output_keys)


def test_downstream_agents_tolerate_missing_parallel_state() -> None:
    weather_formatter = root_agent.sub_agents[2]
    media = root_agent.sub_agents[3]
    aggregator = root_agent.sub_agents[4]

    assert "{weather_grounding?}" in weather_formatter.instruction
    for state_key in [
        "location_result",
        "weather_result",
        "logistics_result",
        "cuisine_result",
        "events_result",
    ]:
        assert f"{{{state_key}?}}" in media.instruction
        assert f"{{{state_key}?}}" in aggregator.instruction
    assert "{media_grounding?}" in aggregator.instruction
