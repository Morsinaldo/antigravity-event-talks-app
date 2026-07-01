# Free-Tier Model Routing Design

## Context

The travel planner currently uses `gemini-2.5-flash-lite` for every ADK agent.
A complete itinerary requires more model requests than the project's free-tier
limit of 10 requests per minute for that model. The workflow reaches the
weather and media tools, then fails with `429 RESOURCE_EXHAUSTED` before the
final response is assembled.

The service currently misclassifies some quota failures as generic
orchestration errors because ADK can wrap the underlying 429 in an
`ExceptionGroup`. The browser can consequently present a misleading local
server communication error.

## Goals

- Complete one itinerary within the available free-tier model quotas.
- Preserve the coordinator, parallel specialists, media enrichment, and final
  aggregation stages.
- Keep the lower-cost model on the majority of calls.
- Prevent overlapping itinerary requests from exhausting the same one-minute
  quota window.
- Return an accurate, actionable error when a provider quota is reached.

## Non-Goals

- Enabling billing or deploying cloud infrastructure.
- Replacing the multi-agent architecture with deterministic Python stages.
- Changing itinerary content, prompts, persistence, or unrelated UI behavior.
- Guaranteeing quotas controlled by Google; active limits remain external
  configuration and can change independently of this application.

## Model Routing

Define two explicit model roles:

- Light model: `gemini-3.1-flash-lite`.
- Control model: `gemini-3.5-flash`.

Use the light model for the location, weather, logistics, cuisine, events, and
weather-formatting agents. This group is expected to perform approximately
seven generation requests for one itinerary, including the weather tool turn.

Use the control model for the coordinator, media enrichment agent, and final
aggregator. This group is expected to perform approximately four generation
requests, including the media tool turn.

The media agent may select at most three high-value entities, must issue no
more than three Wikimedia searches total, and must not retry an unavailable
result. A tool callback enforces the same ceiling even if the model ignores the
instruction. This bounds the model/tool loop below the per-model request limit.

`gemini-2.5-flash-lite` is not used because live verification showed a free
daily limit of 20 requests for the active project and that quota was already
exhausted. Both selected models accepted a live request with the current
project key.

Both model IDs should have environment-variable overrides with the stable IDs
above as defaults. Model construction must receive the selected role explicitly
so that an agent cannot silently fall back to a single global model.

## Request Throttling

Allow at most one `/api/orchestrate` request per local client during a 60-second
window. History and trip-detail endpoints remain unaffected.

A request rejected by this application-level guard returns `429 RATE_LIMITED`
without starting an ADK run or consuming provider quota. The public message
instructs the user to wait one minute before generating another itinerary.

This guard prevents consecutive browser submissions from combining their model
calls in the same quota window. It does not attempt distributed coordination;
the application remains a single-process local prototype.

## Error Handling

Quota detection must recursively inspect ordinary exception causes and nested
`BaseExceptionGroup` members. A nested provider error containing status 429,
`RESOURCE_EXHAUSTED`, or the ADK resource-exhausted exception type maps to the
stable internal code `QUOTA_EXHAUSTED`.

Flask returns a JSON error envelope with HTTP 429 and the request identifier.
The public message must describe the quota condition and recommend waiting
before retrying; it must not claim a fixed daily reset time.

The browser must tolerate a non-JSON error response. It should display an
orchestration error containing the HTTP status and request identifier instead
of reporting that the local server is unreachable. Actual network failures
remain classified as local communication failures.

## Data Flow

1. Flask validates the trip request and checks the one-minute local guard.
2. The coordinator runs on the control model.
3. Independent specialists run in parallel on the light model.
4. Weather formatting runs on the light model.
5. Media enrichment runs on the control model and calls the constrained MCP
   media tool no more than three times.
6. The aggregator runs on the control model and validates the final schema.
7. The service persists the validated result and returns JSON to the browser.
8. Nested quota failures at any stage are normalized to `QUOTA_EXHAUSTED`.

Downstream instructions use ADK optional state placeholders so that an absent
parallel specialist result yields a partial itinerary rather than a `KeyError`.

## Verification

Deterministic tests will verify:

- Every agent is assigned to the intended model role.
- Environment overrides select the correct model identifiers.
- A nested 429 inside an `ExceptionGroup` becomes `QUOTA_EXHAUSTED`.
- Flask returns the correct status and JSON envelope for provider quota errors.
- The local request guard permits the first itinerary and rejects a second
  request within the window.
- The frontend handles both JSON and non-JSON error responses without
  mislabeling an HTTP failure as a network failure.

Verification commands:

```bash
uv run pytest -q
node --test tests/frontend/app.test.mjs
agents-cli lint
```

After deterministic verification, run one live itinerary after a clean quota
window. The run must complete, persist one history record, and render results
without a quota or communication error.

## Risks and Mitigations

- Provider limits may differ by project or change over time. Environment model
  overrides and accurate 429 reporting keep the failure diagnosable.
- A model may internally retry and consume extra requests. The split leaves
  headroom in both per-model windows, while the local guard prevents overlap.
- The lighter model can produce lower-quality specialist content. Existing
  typed schemas and evaluation datasets remain the quality controls; behavioral
  quality belongs in ADK evaluation rather than deterministic pytest assertions.
