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

"""SQLite persistence with explicit lifecycle and defensive JSON decoding."""

import json
import sqlite3
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "travel_orchestrator.db"


class DatabaseDataError(ValueError):
    """Stored data failed integrity decoding."""


def get_db_connection(db_path: str | Path = DATABASE_PATH) -> sqlite3.Connection:
    connection = sqlite3.connect(Path(db_path))
    connection.row_factory = sqlite3.Row
    return connection


def init_db(db_path: str | Path = DATABASE_PATH) -> None:
    """Initialize the local schema idempotently."""

    with get_db_connection(db_path) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                trip_type TEXT NOT NULL,
                input_data TEXT NOT NULL,
                agent_logs TEXT NOT NULL,
                result_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def save_trip(
    title: str,
    trip_type: str,
    input_data_dict: Mapping[str, Any],
    agent_logs_list: Sequence[Mapping[str, Any]],
    result_data_dict: Mapping[str, Any],
    *,
    db_path: str | Path = DATABASE_PATH,
) -> int:
    """Persist already validated JSON-safe values and return their identifier."""

    with get_db_connection(db_path) as connection:
        cursor = connection.execute(
            """
            INSERT INTO trips (title, trip_type, input_data, agent_logs, result_data)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                title,
                trip_type,
                json.dumps(dict(input_data_dict), ensure_ascii=False),
                json.dumps(list(agent_logs_list), ensure_ascii=False),
                json.dumps(dict(result_data_dict), ensure_ascii=False),
            ),
        )
        if cursor.lastrowid is None:
            raise RuntimeError("trip_insert_failed")
    return int(cursor.lastrowid)

def get_trips_history(*, db_path: str | Path = DATABASE_PATH) -> list[dict[str, Any]]:
    """Return bounded trip metadata for the sidebar."""

    with get_db_connection(db_path) as connection:
        rows = connection.execute(
            """
            SELECT id, title, trip_type, created_at
            FROM trips
            ORDER BY created_at DESC, id DESC
            LIMIT 200
            """
        ).fetchall()
    return [dict(row) for row in rows]


def _decode_json(value: str) -> Any:
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        raise DatabaseDataError("invalid_trip_data") from None


def get_trip(trip_id: int, *, db_path: str | Path = DATABASE_PATH) -> dict[str, Any] | None:
    """Return one trip while rejecting corrupted serialized fields."""

    with get_db_connection(db_path) as connection:
        row = connection.execute(
            """
            SELECT id, title, trip_type, input_data, agent_logs, result_data, created_at
            FROM trips
            WHERE id = ?
            """,
            (trip_id,),
        ).fetchone()
    if row is None:
        return None
    result = dict(row)
    result["input_data"] = _decode_json(result["input_data"])
    result["agent_logs"] = _decode_json(result["agent_logs"])
    result["result_data"] = _decode_json(result["result_data"])
    return result


def delete_trip(trip_id: int, *, db_path: str | Path = DATABASE_PATH) -> bool:
    """Delete one trip and report whether a row actually existed."""

    with get_db_connection(db_path) as connection:
        cursor = connection.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
        return cursor.rowcount > 0


def update_trip(
    trip_id: int,
    input_data_dict: Mapping[str, Any],
    agent_logs_list: Sequence[Mapping[str, Any]],
    result_data_dict: Mapping[str, Any],
    *,
    db_path: str | Path = DATABASE_PATH,
) -> None:
    """Update an existing trip record with merged inputs, logs, and results."""

    with get_db_connection(db_path) as connection:
        connection.execute(
            """
            UPDATE trips
            SET input_data = ?, agent_logs = ?, result_data = ?
            WHERE id = ?
            """,
            (
                json.dumps(dict(input_data_dict), ensure_ascii=False),
                json.dumps(list(agent_logs_list), ensure_ascii=False),
                json.dumps(dict(result_data_dict), ensure_ascii=False),
                trip_id,
            ),
        )
