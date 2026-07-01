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

"""Structured local audit logging with correlation and bounded retention."""

import json
import logging
from contextvars import ContextVar
from datetime import UTC, datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Any

from trip_planner.security import redact_sensitive

correlation_id: ContextVar[str] = ContextVar("correlation_id", default="unassigned")

REALTIME_LOGS: dict[str, list[dict[str, Any]]] = {}

def add_realtime_log(request_id: str, agent: str, status: str, message: str, **kwargs: Any) -> None:
    if not request_id or request_id == "unassigned":
        return
    if request_id not in REALTIME_LOGS:
        REALTIME_LOGS[request_id] = []

    # Avoid duplicate thinking logs for same status
    if status == "thinking":
        last_log = REALTIME_LOGS[request_id][-1] if REALTIME_LOGS[request_id] else None
        if last_log and last_log.get("agent") == agent and last_log.get("status") == "thinking" and last_log.get("message") == message:
            return

    log_entry = {
        "timestamp": datetime.now(UTC).isoformat(),
        "agent": agent,
        "status": status,
        "message": message,
    }
    log_entry.update(kwargs)
    REALTIME_LOGS[request_id].append(log_entry)

EVENT_FIELDS = {
    "agent",
    "component",
    "duration_ms",
    "error_code",
    "outcome",
    "status",
    "tool",
}


class JsonAuditFormatter(logging.Formatter):
    """Serialize only explicitly approved audit fields."""

    def format(self, record: logging.LogRecord) -> str:
        raw_data = getattr(record, "event_data", {})
        safe_data = redact_sensitive(raw_data if isinstance(raw_data, dict) else {})
        payload: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "severity": record.levelname,
            "event": getattr(record, "event_name", "application.event"),
            "correlation_id": correlation_id.get(),
        }
        payload.update({key: safe_data[key] for key in EVENT_FIELDS if key in safe_data})
        return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))


def configure_logging(log_dir: str | Path = "logs") -> logging.Logger:
    """Configure the dedicated application audit logger once."""

    directory = Path(log_dir)
    directory.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("trip_planner.audit")
    logger.setLevel(logging.INFO)
    logger.propagate = False
    for existing in list(logger.handlers):
        existing.close()
        logger.removeHandler(existing)
    handler = RotatingFileHandler(
        directory / "travel-planner.jsonl",
        maxBytes=2_000_000,
        backupCount=3,
        encoding="utf-8",
    )
    handler.setFormatter(JsonAuditFormatter())
    logger.addHandler(handler)
    return logger


def audit_event(logger: logging.Logger, event_name: str, **event_data: Any) -> None:
    """Emit a structured event through the allowlisted formatter."""

    logger.info("audit", extra={"event_name": event_name, "event_data": event_data})
