# Free-Tier Model Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete one travel itinerary within free-tier per-model request limits and report provider or HTTP failures accurately.

**Architecture:** Route specialist calls to Gemini 3.1 Flash-Lite and control/media/finalization calls to Gemini 3.5 Flash. Admit one itinerary per client per minute, recursively normalize nested ADK quota errors, and isolate browser response parsing in a testable JavaScript module.

**Tech Stack:** Python 3.12, Google ADK, Gemini Developer API, Flask, Pydantic, pytest, vanilla JavaScript, Node test runner.

**Design:** `docs/superpowers/specs/2026-06-30-free-tier-model-routing-design.md`

---

## File Map

- Modify `trip_planner/agent.py`: model roles and explicit agent assignment.
- Modify `trip_planner/service.py`: nested quota-error recognition.
- Modify `app.py`: one-orchestration-per-minute default and public errors.
- Create `static/api.js`: safe HTTP response parsing.
- Modify `templates/index.html` and `static/app.js`: use the response helper.
- Modify existing Python and frontend test files for regression coverage.

### Task 1: Route Agents Across Free-Tier Models

**Files:**
- Modify: `tests/unit/test_agent_structure.py`
- Modify: `trip_planner/agent.py:50-327`

- [ ] **Step 1: Write the failing model-assignment test**

```python
from trip_planner.agent import CONTROL_MODEL_NAME, LIGHT_MODEL_NAME


def test_agents_are_split_across_free_tier_model_quotas() -> None:
    parallel = root_agent.sub_agents[1]
    specialists = {agent.name: agent for agent in parallel.sub_agents}
    assert {agent.model.model for agent in specialists.values()} == {LIGHT_MODEL_NAME}
    assert root_agent.sub_agents[2].model.model == LIGHT_MODEL_NAME
    assert root_agent.sub_agents[0].model.model == CONTROL_MODEL_NAME
    assert root_agent.sub_agents[3].model.model == CONTROL_MODEL_NAME
    assert root_agent.sub_agents[4].model.model == CONTROL_MODEL_NAME
```

Inspect one agent and adjust only the accessor if this ADK version exposes the
model ID directly as `agent.model`.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/unit/test_agent_structure.py::test_agents_are_split_across_free_tier_model_quotas -q`

Expected: FAIL because the role constants do not exist.

- [ ] **Step 3: Implement role-aware model construction**

```python
LIGHT_MODEL_NAME = os.getenv("GEMINI_LIGHT_MODEL", "gemini-3.1-flash-lite")
CONTROL_MODEL_NAME = os.getenv("GEMINI_CONTROL_MODEL", "gemini-3.5-flash")


def _model(model_name: str) -> Gemini:
    return Gemini(
        model=model_name,
        retry_options=types.HttpRetryOptions(attempts=3, initial_delay=1, max_delay=8),
    )
```

Add `model_name: str` to `_structured_agent`. Use the light model for location,
weather, logistics, cuisine, events, and weather formatting. Use the control
model for coordinator, media enrichment, and aggregation. Preserve prompts,
tools, schemas, and agent ordering.

- [ ] **Step 4: Run agent-structure tests**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/unit/test_agent_structure.py -q`

Expected: PASS.

- [ ] **Step 5: Review the focused diff**

Run: `git diff -- trip_planner/agent.py tests/unit/test_agent_structure.py`

### Task 2: Normalize Nested Quota Errors

**Files:**
- Modify: `tests/integration/test_orchestration_service.py`
- Modify: `trip_planner/service.py:34-101`

- [ ] **Step 1: Write the failing nested-error test**

```python
@pytest.mark.asyncio
async def test_service_maps_nested_resource_exhausted_to_quota_error() -> None:
    async def failing_executor(_request: TripRequest, _request_id: str) -> dict[str, object]:
        raise ExceptionGroup("parallel failed", [RuntimeError("429 RESOURCE_EXHAUSTED")])

    service = OrchestrationService(executor=failing_executor)
    with pytest.raises(RuntimeError, match="^QUOTA_EXHAUSTED$"):
        await service.orchestrate(TripRequest(destination="Fortaleza"), "req-12345678")
```

Make the existing sanitized-error assertion match the stable uppercase code.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/integration/test_orchestration_service.py::test_service_maps_nested_resource_exhausted_to_quota_error -q`

Expected: FAIL with `ORCHESTRATION_FAILED`.

- [ ] **Step 3: Implement recursive exception traversal**

```python
def _exception_chain(exc: BaseException):
    yield exc
    if isinstance(exc, BaseExceptionGroup):
        for nested in exc.exceptions:
            yield from _exception_chain(nested)
    if exc.__cause__ is not None:
        yield from _exception_chain(exc.__cause__)
    elif exc.__context__ is not None:
        yield from _exception_chain(exc.__context__)


def _is_quota_error(exc: BaseException) -> bool:
    return any(
        "429" in str(item)
        or "RESOURCE_EXHAUSTED" in str(item)
        or "ResourceExhausted" in type(item).__name__
        or "_ResourceExhaustedError" in type(item).__name__
        for item in _exception_chain(exc)
    )
```

Use `_is_quota_error(exc)` in `orchestrate` and continue exposing only stable
error codes.

- [ ] **Step 4: Run service tests**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/integration/test_orchestration_service.py -q`

Expected: PASS with no internal details in public exceptions.

- [ ] **Step 5: Review the focused diff**

Run: `git diff -- trip_planner/service.py tests/integration/test_orchestration_service.py`

### Task 2A: Bound Media Tool Loops and Optional State

**Files:**
- Modify: `tests/unit/test_agent_structure.py`
- Modify: `trip_planner/agent.py`

- [ ] Test that the fourth `search_commons_media` call is rejected with
  `media_search_limit_reached`.
- [ ] Enforce a limit of three media searches in `_before_tool` and instruct the
  media agent to select only three entities, issue calls together, and never
  retry.
- [ ] Test that weather formatting, media enrichment, and aggregation use ADK
  optional placeholders for state produced by parallel agents.
- [ ] Replace required downstream placeholders with `{state_key?}`.
- [ ] Run `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/unit/test_agent_structure.py -q`.

### Task 3: Enforce One Itinerary Per Minute

**Files:**
- Modify: `tests/integration/test_api.py`
- Modify: `app.py:29-220`

- [ ] **Step 1: Write failing default-limit and quota-envelope tests**

Add `QuotaService`, which raises `RuntimeError("QUOTA_EXHAUSTED")`, then add:

```python
def test_default_orchestration_limit_is_one_request_per_minute(tmp_path) -> None:
    client = make_client(tmp_path)
    assert client.post("/api/orchestrate", json={"destination": "Fortaleza"}).status_code == 200
    response = client.post("/api/orchestrate", json={"destination": "Natal"})
    assert response.status_code == 429
    assert response.json["error"]["code"] == "RATE_LIMITED"


def test_quota_error_returns_json_429_with_request_id(tmp_path) -> None:
    client = make_client(tmp_path, service=QuotaService())
    response = client.post("/api/orchestrate", json={"destination": "Fortaleza"})
    assert response.status_code == 429
    assert response.json["error"]["code"] == "QUOTA_EXHAUSTED"
    assert response.json["request_id"] == response.headers["X-Request-ID"]
```

Also extend the invalid-payload test with a subsequent valid request and assert
that it succeeds. This proves rejected input does not consume the expensive
orchestration slot.

- [ ] **Step 2: Run API tests and verify the default-limit failure**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/integration/test_api.py -q`

Expected: the default-limit test FAILS because the current default is 10.

- [ ] **Step 3: Change the default and messages**

Set `LocalRateLimiter(max_requests=1, window_seconds=60)` by default. Move the
limiter check below JSON parsing and `TripRequest` validation, immediately
before `service.orchestrate_sync`, so only valid attempts consume a slot. Use:

```python
"QUOTA_EXHAUSTED": (
    "Limite temporário da API Gemini atingido. "
    "Aguarde pelo menos um minuto antes de tentar novamente."
),
"RATE_LIMITED": "Aguarde um minuto antes de gerar outro roteiro.",
```

- [ ] **Step 4: Run API tests**

Run: `UV_CACHE_DIR=/tmp/uv-cache uv run pytest tests/integration/test_api.py -q`

Expected: PASS.

- [ ] **Step 5: Review the focused diff**

Run: `git diff -- app.py tests/integration/test_api.py`

### Task 4: Distinguish HTTP Failures From Network Failures

**Files:**
- Create: `static/api.js`
- Modify: `tests/frontend/app.test.mjs`
- Modify: `templates/index.html`
- Modify: `static/app.js:670-715`

- [ ] **Step 1: Write failing response-helper tests**

Require `../../static/api.js`. Test a JSON 429 response, a non-JSON HTTP 500
response, and an empty response. Use response doubles with `status`,
`headers.get()`, and `text()`. Assert that JSON preserves `QUOTA_EXHAUSTED` and
that non-JSON/empty bodies return `HTTP_ERROR`, include the status and request
ID, and never include the raw body.

- [ ] **Step 2: Run frontend tests and verify failure**

Run: `node --test tests/frontend/app.test.mjs`

Expected: FAIL because `static/api.js` does not exist.

- [ ] **Step 3: Implement the standalone helper**

Create `static/api.js` with the repository's Apache-2.0 header and the same
browser/CommonJS wrapper as `static/media.js`. Export:

```javascript
async function readApiResponse(response) {
    const requestId = response.headers?.get?.('X-Request-ID') || null;
    const rawBody = await response.text();
    try {
        const payload = JSON.parse(rawBody);
        if (!payload.request_id && requestId) payload.request_id = requestId;
        return payload;
    } catch (_error) {
        return {
            success: false,
            request_id: requestId,
            error: {
                code: 'HTTP_ERROR',
                message: `O servidor respondeu com HTTP ${response.status}.`,
            },
        };
    }
}
```

- [ ] **Step 4: Load and use the helper**

Load `/static/api.js` before `/static/app.js` in `templates/index.html`.
Replace `response.json()` with `TripApi.readApiResponse(response)`. Append the
request ID to displayed API errors when present. Keep `catch` exclusively for
fetch/network exceptions.

- [ ] **Step 5: Run frontend tests**

Run: `node --test tests/frontend/app.test.mjs`

Expected: PASS.

- [ ] **Step 6: Review the focused diff**

Run: `git diff -- static/api.js static/app.js templates/index.html tests/frontend/app.test.mjs`

### Task 5: Full Verification and Live Smoke Test

**Files:** Verify only.

- [ ] **Step 1: Run deterministic suites**

Run:

```bash
UV_CACHE_DIR=/tmp/uv-cache uv run pytest -q
node --test tests/frontend/app.test.mjs
UV_CACHE_DIR=/tmp/uv-cache agents-cli lint --skip-codespell --skip-ty
```

Expected: all commands PASS; address only regressions introduced here.

- [ ] **Step 2: Restart Flask and verify availability**

Restart the existing process on port 5001 with
`UV_CACHE_DIR=/tmp/uv-cache uv run python app.py`, then load
`http://127.0.0.1:5001/`.

- [ ] **Step 3: Run one live itinerary after a clean quota window**

Submit the default Natal-to-Fortaleza itinerary once. Expect HTTP 200, one new
history record, rendered results, and `orchestration.completed` plus
`request.completed` audit events.

- [ ] **Step 4: Verify local throttling**

Immediately submit a second itinerary. Expect JSON HTTP 429 `RATE_LIMITED`, a
one-minute wait message, and no new orchestration-started audit event.

- [ ] **Step 5: Inspect final repository state**

Run:

```bash
git status --short
git diff --check
```

Confirm unrelated pre-existing work remains unchanged and unstaged.

## Commit Guidance

The implementation paths are part of a pre-existing dirty worktree, including
untracked application files. Do not stage or commit them without a separate
explicit user request because that would also commit work predating this fix.
