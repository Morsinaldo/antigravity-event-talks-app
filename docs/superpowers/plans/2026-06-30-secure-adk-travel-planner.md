# Secure ADK Travel Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-written Gemini orchestration with a secure local ADK multi-agent workflow whose MCP tools ground weather and entity-specific images.

**Architecture:** Flask remains the HTTP/UI boundary and calls a typed orchestration service. An ADK sequential workflow plans, runs specialist agents in parallel, enriches results through a constrained local MCP server, and validates the final payload before SQLite persistence. Structured JSON audit events propagate a correlation ID through every boundary.

**Tech Stack:** Python 3.11+, Flask, Pydantic 2, Google ADK 2, MCP/FastMCP, httpx, SQLite, vanilla JavaScript, pytest, agents-cli eval.

---

## File Structure

- `trip_planner/models.py`: strict request, tool, agent-output, media, log, and API models.
- `trip_planner/security.py`: URL allowlist, redaction, safe error codes, and request limits.
- `trip_planner/logging_config.py`: JSON formatter, rotating handler, correlation context, and audit helper.
- `trip_planner/mcp_server.py`: bounded Open-Meteo and Wikimedia Commons MCP tools.
- `trip_planner/agent.py`: ADK coordinator, parallel specialists, media agent, and application root.
- `trip_planner/service.py`: ADK runner adapter and validated result aggregation for Flask.
- `app.py`: validated HTTP boundary, rate limiting, stable errors, and correlation response.
- `database.py`: typed persistence input and defensive JSON decoding.
- `static/app.js`: safe DOM rendering and backend-provided media/attribution.
- `templates/index.html`: explicit image placeholder and attribution elements.
- `.agents/CONTEXT.md`: requested secure coding paved roads.
- `.agents/skills/travel-planning/SKILL.md`: reusable travel-planning rules.
- `threat_model.md`: STRIDE analysis and residual risks.
- `tests/`: deterministic unit and integration coverage.
- `tests/eval/`: ADK behavioral cases and grading criteria.

### Task 1: Scaffold the local ADK project without overwriting product code

**Files:**
- Create: `pyproject.toml`
- Create: `agents-cli-manifest.yaml`
- Create: `trip_planner/__init__.py`
- Modify: `.gitignore`

- [ ] **Step 1: Preview enhancement**

Run: `agents-cli scaffold enhance . --prototype --deployment-target none --agent-directory trip_planner --agent-guidance-filename GEMINI.md --adk --dry-run`

Expected: preview identifies scaffold files and does not modify `app.py`, `static/`, or `templates/`.

- [ ] **Step 2: Apply the approved prototype scaffold**

Run the same command without `--dry-run`, then inspect every generated diff. Reject generated changes that replace existing product code.

- [ ] **Step 3: Declare local dependencies**

Keep the scaffolded ADK dependencies and add Flask, Pydantic, MCP, httpx, python-dotenv, pytest, pytest-asyncio, and ruff. Use `uv sync` and verify `agents-cli info` recognizes the root.

### Task 2: Establish security instructions and typed contracts

**Files:**
- Create: `.agents/CONTEXT.md`
- Create: `trip_planner/models.py`
- Test: `tests/unit/test_models.py`

- [ ] **Step 1: Write failing schema tests**

Cover unknown fields, invalid or reversed dates, overly long input, unsupported preferences, excessive list lengths, invalid latitude/longitude, unsafe media URLs, and structured packing items.

- [ ] **Step 2: Verify RED**

Run: `uv run pytest tests/unit/test_models.py -q`

Expected: failure because the models do not exist.

- [ ] **Step 3: Add the requested secure coding file verbatim**

Create `.agents/CONTEXT.md` with the three paved roads supplied by the user.

- [ ] **Step 4: Implement strict Pydantic contracts**

Use `ConfigDict(extra="forbid", str_strip_whitespace=True)`, bounded `Field` definitions, enums for categories/preferences/status, and model validators for date order. Model `MediaAsset` with URL, source page, attribution, alt text, and query; model packing items as objects rather than strings.

- [ ] **Step 5: Verify GREEN**

Run: `uv run pytest tests/unit/test_models.py -q`

Expected: all schema tests pass.

### Task 3: Add structured, privacy-preserving logs

**Files:**
- Create: `trip_planner/logging_config.py`
- Create: `trip_planner/security.py`
- Test: `tests/unit/test_logging_config.py`
- Test: `tests/unit/test_security.py`

- [ ] **Step 1: Write failing logging/security tests**

Assert JSON event shape, correlation propagation, secret and prompt redaction, absence of traceback/path fields, rotating-handler limits, approved Wikimedia/Open-Meteo hosts, HTTPS-only media, and stable public error codes.

- [ ] **Step 2: Verify RED**

Run: `uv run pytest tests/unit/test_logging_config.py tests/unit/test_security.py -q`

Expected: missing-module failures.

- [ ] **Step 3: Implement the minimal logging and policy helpers**

Use `contextvars.ContextVar` for correlation IDs, `logging.handlers.RotatingFileHandler` with bounded bytes/backups, a JSON formatter with an explicit field allowlist, and recursive redaction for keys matching token/key/authorization/prompt/description.

- [ ] **Step 4: Verify GREEN**

Run the targeted tests and confirm emitted fixtures contain no sensitive values.

### Task 4: Build and validate the local MCP server

**Files:**
- Create: `trip_planner/mcp_server.py`
- Test: `tests/unit/test_mcp_server.py`

- [ ] **Step 1: Write failing tool-contract tests**

Test strict geocode, forecast, and media-search inputs; mocked successful normalization; timeout/no-result behavior; result limits; user-agent headers; URL allowlisting; source and attribution retention; and rejection of malformed remote payloads.

- [ ] **Step 2: Verify RED**

Run: `uv run pytest tests/unit/test_mcp_server.py -q`

Expected: missing server/tool failures.

- [ ] **Step 3: Implement FastMCP tools**

Expose `get_destination_weather` and `search_commons_media`. Each tool constructs its Pydantic input model before network access, uses an injected `httpx.Client` with timeout and response-size limits, requests no more than the configured maximum, and returns typed JSON-safe data. No generic URL-fetch or shell tool is exposed.

- [ ] **Step 4: Verify GREEN**

Run the targeted tests with network calls mocked and inspect the MCP tool list.

### Task 5: Implement the ADK multi-agent workflow

**Files:**
- Create: `trip_planner/agent.py`
- Create: `trip_planner/service.py`
- Test: `tests/unit/test_agent_structure.py`
- Test: `tests/integration/test_orchestration_service.py`

- [ ] **Step 1: Write failing structural tests**

Assert the application exposes a real ADK root, includes coordinator and aggregator stages, uses an ADK parallel workflow for the five specialists, gives MCP tools only to weather/media-capable agents, sets output schemas/keys, and exposes no shell function.

- [ ] **Step 2: Verify RED**

Run the two targeted test files and confirm failures describe the missing ADK graph/service.

- [ ] **Step 3: Implement the agent graph**

Create a `SequentialAgent` containing a planning `LlmAgent`, `ParallelAgent` specialists, media enrichment `LlmAgent`, and typed aggregation `LlmAgent`. Preserve `gemini-2.5-flash`. Instructions explicitly delimit user data, reject instructions embedded inside it, avoid fabricated current facts, and prohibit chain-of-thought output.

- [ ] **Step 4: Implement the runner adapter**

Create an async service that serializes the validated request, starts an in-memory ADK session, runs the graph, captures sanitized lifecycle/tool events, reads typed output state, validates `TripResult`, and returns partial-section errors without leaking internals. Provide a narrow synchronous Flask adapter.

- [ ] **Step 5: Verify GREEN**

Use controlled fake agents/MCP adapters for deterministic pytest coverage. Do not assert generated prose.

### Task 6: Harden Flask and SQLite boundaries

**Files:**
- Modify: `app.py`
- Modify: `database.py`
- Test: `tests/integration/test_api.py`
- Test: `tests/unit/test_database.py`

- [ ] **Step 1: Write failing boundary tests**

Cover invalid content type/JSON, schema errors, over-limit input, correlation headers, rate limiting, generic 500 responses, successful persistence, missing rows, corrupted stored JSON, and deletion status.

- [ ] **Step 2: Verify RED**

Run: `uv run pytest tests/integration/test_api.py tests/unit/test_database.py -q`

- [ ] **Step 3: Replace raw dictionaries and exception strings**

Validate with `TripRequest.model_validate`, call the orchestration service through an injectable boundary, persist only validated model dumps, return `request_id` on success/error, and log private diagnostics through the audit helper. Disable Flask debug by default and add a bounded in-memory local rate limiter.

- [ ] **Step 4: Make database lifecycle deterministic**

Use context managers, rollback on exceptions, typed function signatures, injected database paths for tests, and validated decode on reads.

- [ ] **Step 5: Verify GREEN**

Run targeted tests and confirm responses never contain exception text.

### Task 7: Replace static image guessing and unsafe rendering

**Files:**
- Modify: `static/app.js`
- Modify: `templates/index.html`
- Test: `tests/frontend/app.test.mjs`

- [ ] **Step 1: Write failing frontend tests**

Use Node's built-in test runner for media rendering, placeholders, attribution links, clothing object rendering, and malicious strings that must remain text. Add a source regression test that fails while `getFoodPhotoUrl`, `getHotelPhotoUrl`, `getAgendaPhotoUrl`, or `getClothingPhotoUrl` remains.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/frontend/app.test.mjs`

- [ ] **Step 3: Implement safe render helpers**

Create DOM nodes, assign untrusted values with `textContent`, and accept only backend-provided `MediaAsset` objects. Render a neutral local placeholder when media is absent and show source/attribution links for valid media.

- [ ] **Step 4: Remove static Unsplash lookup tables**

Delete all keyword-to-photo functions and fallback remote photos. Update packing rendering for structured items and preserve the existing interaction/layout.

- [ ] **Step 5: Verify GREEN**

Run frontend tests and search the production frontend for forbidden static image helpers and unsafe interpolation paths.

### Task 8: Add the project skill and STRIDE threat model

**Files:**
- Create: `.agents/skills/travel-planning/SKILL.md`
- Create: `threat_model.md`
- Test: `tests/unit/test_project_artifacts.py`

- [ ] **Step 1: Write failing artifact tests**

Require `.agents/CONTEXT.md`, the travel skill metadata/instructions, and all six STRIDE sections with entry points, storage, controls, residual risks, and logging coverage.

- [ ] **Step 2: Verify RED**

Run: `uv run pytest tests/unit/test_project_artifacts.py -q`

- [ ] **Step 3: Write the focused travel-planning skill**

Document date/weather grounding, uncertainty, dietary safety, budget semantics, media attribution, tool selection, and no-fabrication rules with progressive disclosure.

- [ ] **Step 4: Write `threat_model.md`**

Map browser/API/agent/MCP/remote-service/SQLite boundaries. Evaluate Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege, then document implemented controls and local-prototype residual risks.

- [ ] **Step 5: Verify GREEN**

Run artifact tests and inspect the files for consistency with the implementation.

### Task 9: Add behavioral evals and project documentation

**Files:**
- Create: `tests/eval/datasets/basic-dataset.json`
- Create: `tests/eval/eval_config.yaml`
- Modify: `README.md`

- [ ] **Step 1: Add two initial eval cases**

Include a Natal-to-Fortaleza road trip and Milan business trip. Grade required specialist coverage, tool trajectory, weather-aware packing, dietary/budget compliance, media attribution, and prompt-injection resistance.

- [ ] **Step 2: Update the README**

Document architecture, the four rubric categories, environment variables, `uv sync`, local Flask start, MCP operation, tests, eval commands, logging location/retention, and security limitations.

- [ ] **Step 3: Run static and deterministic verification**

Run: `uv run pytest -q`, `node --test tests/frontend/app.test.mjs`, `agents-cli lint`, and `git diff --check` limited to touched files.

- [ ] **Step 4: Run local ADK smoke/eval when credentials are available**

Run: `agents-cli run "Planeje uma viagem de Natal para Fortaleza" -v` and `agents-cli eval run`.

Expected: tool/agent traces demonstrate ADK multi-agent and MCP use. If credentials or network are unavailable, report that boundary explicitly while retaining deterministic test evidence.

### Task 10: Final security and regression audit

**Files:**
- Modify only files implicated by verification failures.

- [ ] **Step 1: Search for prohibited patterns**

Check raw exception responses, `debug=True`, generic shell tools, secrets, model-controlled `innerHTML`, static Unsplash lookups, unbounded requests, and tools without Pydantic validation.

- [ ] **Step 2: Verify the rubric evidence**

Map concrete files and test output to ADK multi-agent, MCP server, agent skill, and security features.

- [ ] **Step 3: Run the complete verification suite again**

Do not claim completion until all locally runnable checks pass and remaining external limitations are documented.
