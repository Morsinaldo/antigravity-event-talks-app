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

from trip_planner.security import is_allowed_url, redact_sensitive, safe_error


def test_url_policy_requires_https_and_exact_host() -> None:
    assert is_allowed_url("https://upload.wikimedia.org/example.jpg", {"upload.wikimedia.org"})
    assert not is_allowed_url("http://upload.wikimedia.org/example.jpg", {"upload.wikimedia.org"})
    assert not is_allowed_url(
        "https://upload.wikimedia.org.evil.example/example.jpg", {"upload.wikimedia.org"}
    )
    assert not is_allowed_url("file:///etc/passwd", {"upload.wikimedia.org"})


def test_redaction_is_recursive_and_does_not_mutate_input() -> None:
    original = {
        "destination": "Fortaleza",
        "api_key": "super-secret",
        "nested": {"authorization": "Bearer abc", "status": "ok"},
        "items": [{"prompt": "private prompt"}],
    }

    redacted = redact_sensitive(original)

    assert redacted == {
        "destination": "Fortaleza",
        "api_key": "[REDACTED]",
        "nested": {"authorization": "[REDACTED]", "status": "ok"},
        "items": [{"prompt": "[REDACTED]"}],
    }
    assert original["api_key"] == "super-secret"


def test_public_error_never_contains_exception_details() -> None:
    error = safe_error(ValueError("secret /Users/alice/.env"), "ORCHESTRATION_FAILED")

    assert error == {
        "code": "ORCHESTRATION_FAILED",
        "message": "Não foi possível concluir a solicitação.",
    }
