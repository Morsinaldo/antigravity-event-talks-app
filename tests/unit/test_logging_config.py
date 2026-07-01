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
import logging
from logging.handlers import RotatingFileHandler

from trip_planner.logging_config import (
    JsonAuditFormatter,
    audit_event,
    configure_logging,
    correlation_id,
)


def test_formatter_emits_allowlisted_shape_and_redacts_secrets() -> None:
    formatter = JsonAuditFormatter()
    record = logging.LogRecord("test", logging.INFO, __file__, 1, "ignored", (), None)
    record.event_name = "tool.completed"
    record.event_data = {"tool": "weather", "api_key": "secret", "duration_ms": 12}

    token = correlation_id.set("req-12345678")
    try:
        payload = json.loads(formatter.format(record))
    finally:
        correlation_id.reset(token)

    assert payload["correlation_id"] == "req-12345678"
    assert payload["event"] == "tool.completed"
    assert payload["tool"] == "weather"
    assert payload["duration_ms"] == 12
    assert "secret" not in json.dumps(payload)
    assert "pathname" not in payload


def test_configure_logging_uses_bounded_rotation(tmp_path) -> None:
    logger = configure_logging(tmp_path)
    handler = next(item for item in logger.handlers if isinstance(item, RotatingFileHandler))

    assert handler.maxBytes == 2_000_000
    assert handler.backupCount == 3


def test_audit_event_writes_json_with_current_correlation(tmp_path) -> None:
    logger = configure_logging(tmp_path)
    token = correlation_id.set("req-abcdefgh")
    try:
        audit_event(logger, "request.completed", component="flask", outcome="success")
        for handler in logger.handlers:
            handler.flush()
    finally:
        correlation_id.reset(token)

    payload = json.loads((tmp_path / "travel-planner.jsonl").read_text().strip())
    assert payload["correlation_id"] == "req-abcdefgh"
    assert payload["component"] == "flask"
    assert payload["outcome"] == "success"
