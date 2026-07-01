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

"""Security policies shared by the web, agent, and MCP boundaries."""

from collections.abc import Mapping, Sequence
from typing import Any
from urllib.parse import urlsplit

SENSITIVE_KEY_PARTS = (
    "api_key",
    "apikey",
    "authorization",
    "cookie",
    "description",
    "password",
    "prompt",
    "secret",
    "token",
)


def is_allowed_url(url: str, allowed_hosts: set[str]) -> bool:
    """Return true only for HTTPS URLs whose normalized hostname is allowlisted."""

    try:
        parsed = urlsplit(url)
        return parsed.scheme == "https" and parsed.hostname in allowed_hosts
    except (TypeError, ValueError):
        return False


def _is_sensitive_key(key: object) -> bool:
    normalized = str(key).casefold()
    return any(part in normalized for part in SENSITIVE_KEY_PARTS)


def redact_sensitive(value: Any) -> Any:
    """Copy nested data while replacing values attached to sensitive keys."""

    if isinstance(value, Mapping):
        return {
            key: "[REDACTED]" if _is_sensitive_key(key) else redact_sensitive(item)
            for key, item in value.items()
        }
    if isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
        return [redact_sensitive(item) for item in value]
    return value


def safe_error(_exception: Exception, code: str) -> dict[str, str]:
    """Build a stable public error without serializing private exception details."""

    return {"code": code, "message": "Não foi possível concluir a solicitação."}
