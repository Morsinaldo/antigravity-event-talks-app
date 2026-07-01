# TripOrchestrator

Local travel planner built with Google Agent Development Kit (ADK), a constrained
MCP server, Flask, SQLite, and a vanilla JavaScript interface.

## Project Requirements Covered

- **ADK multi-agent system:** coordinator plus location, weather, logistics,
  cuisine, and events specialists; independent specialists run concurrently.
- **MCP server:** typed tools ground weather in Open-Meteo and images in
  Wikimedia Commons.
- **Agent customization:** `.agents/CONTEXT.md` defines secure paved roads and
  `.agents/skills/` contains reusable project skills.
- **Security:** strict Pydantic boundaries, fixed tool surface, URL allowlists,
  safe DOM rendering, request limits, sanitized errors/logs, and STRIDE modeling.

## Architecture

`app.py` validates the browser request and calls `trip_planner/service.py`. The
service executes the ADK graph in `trip_planner/agent.py`; weather and media
agents use `trip_planner/mcp_server.py`. The final typed result is stored by
`database.py`. The browser displays only backend-provided Wikimedia media with
source attribution, or a local placeholder.

## Local Setup

Requires Python 3.11–3.13, `uv`, and `agents-cli` 0.5 or newer.

```bash
uv sync
cp .env.example .env  # if an example is provided, otherwise create .env
```

Set one development credential:

```text
GEMINI_API_KEY=your-key
```

Start the existing Flask UI:

```bash
uv run python app.py
```

Open `http://127.0.0.1:5001`. The MCP process is started by ADK over stdio; it
does not expose a public network port.

## Tests and Evaluation

```bash
uv run pytest -q
node --test tests/frontend/app.test.mjs
agents-cli lint
agents-cli run '{"destination":"Fortaleza, CE"}' -v
agents-cli eval run
```

Pytest covers deterministic code contracts. ADK evals cover nondeterministic
planning quality, tool use, hallucination, safety, media relevance, and prompt
injection resistance.

## Logs

Structured audit records are written to `logs/travel-planner.jsonl`. Each record
contains a correlation ID, lifecycle event, component, outcome, optional tool or
agent, duration, and stable error code. Logs rotate at 2 MB with three backups.
Credentials, authorization data, prompts, descriptions, raw payloads,
chain-of-thought, stack traces, and local paths are excluded or redacted.

## Security and Limitations

See [threat_model.md](threat_model.md). This is a local prototype without user
authentication, booking/payment actions, encrypted history, signed logs, or a
distributed rate limiter. Verify routes, prices, availability, events, dietary
details, and forecasts before consequential decisions.
