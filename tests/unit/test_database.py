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

import sqlite3

import pytest

import database


def test_database_round_trip_uses_explicit_path(tmp_path) -> None:
    db_path = tmp_path / "trips.db"
    database.init_db(db_path)

    trip_id = database.save_trip(
        title="Rota do Sol",
        trip_type="roadtrip",
        input_data_dict={"destination": "Fortaleza"},
        agent_logs_list=[],
        result_data_dict={"errors": []},
        db_path=db_path,
    )

    trip = database.get_trip(trip_id, db_path=db_path)
    assert trip is not None
    assert trip["input_data"] == {"destination": "Fortaleza"}
    assert database.get_trips_history(db_path=db_path)[0]["id"] == trip_id
    assert database.delete_trip(trip_id, db_path=db_path)
    assert not database.delete_trip(trip_id, db_path=db_path)


def test_database_rejects_corrupted_json(tmp_path) -> None:
    db_path = tmp_path / "trips.db"
    database.init_db(db_path)
    with sqlite3.connect(db_path) as connection:
        connection.execute(
            """
            INSERT INTO trips (title, trip_type, input_data, agent_logs, result_data)
            VALUES (?, ?, ?, ?, ?)
            """,
            ("Bad", "custom", "{broken", "[]", "{}"),
        )

    with pytest.raises(database.DatabaseDataError, match="invalid_trip_data"):
        database.get_trip(1, db_path=db_path)
