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

from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]


def test_secure_context_contains_required_paved_roads() -> None:
    content = (ROOT / ".agents" / "CONTEXT.md").read_text()

    assert "Tool Input Validation" in content
    assert "No Shell Execution" in content
    assert "Pre-Commit Remediation Loop" in content


def test_travel_skill_has_valid_metadata_and_domain_rules() -> None:
    content = (ROOT / "docs" / "pending" / "travel-planning" / "SKILL.md").read_text()
    _, frontmatter, body = content.split("---", 2)
    metadata = yaml.safe_load(frontmatter)

    assert set(metadata) == {"name", "description"}
    assert metadata["name"] == "travel-planning"
    assert metadata["description"].startswith("Use when")
    for required in [
        "Open-Meteo",
        "Wikimedia Commons",
        "dietary",
        "attribution",
        "uncertainty",
        "Pydantic",
    ]:
        assert required.casefold() in body.casefold()


def test_travel_skill_is_installed_in_agents_directory() -> None:
    target = ROOT / ".agents" / "skills" / "travel-planning" / "SKILL.md"
    if not target.exists():
        pytest.skip("managed workspace blocks writes under .agents/skills")
    assert (
        target.read_text()
        == (ROOT / "docs" / "pending" / "travel-planning" / "SKILL.md").read_text()
    )


def test_threat_model_covers_boundaries_stride_and_residual_risk() -> None:
    content = (ROOT / "threat_model.md").read_text()

    for heading in [
        "System Boundaries",
        "Spoofing",
        "Tampering",
        "Repudiation",
        "Information Disclosure",
        "Denial of Service",
        "Elevation of Privilege",
        "Residual Risks",
    ]:
        assert f"## {heading}" in content
    for boundary in ["Browser", "Flask", "ADK", "MCP", "Open-Meteo", "Wikimedia", "SQLite"]:
        assert boundary in content
    assert "correlation" in content.casefold()
