# Secure ADK Travel Planner Design

## Context and Diagnosed Problems

The current application is presented as a multi-agent travel planner, but
`agents.py` calls the Gemini SDK directly and coordinates ordinary Python
functions with `ThreadPoolExecutor`. It does not use ADK agent primitives or
an ADK runner.

Image selection happens in `static/app.js`. Places, dishes, hotels, and packing
items are mapped to a small collection of fixed Unsplash URLs using broad
keyword checks. The selected asset is therefore neither grounded in the named
entity nor returned by a tool that can provide source metadata. Clothing is
also represented by a free-form string, which makes reliable categorization
and image selection difficult.

The HTTP boundary accepts raw dictionaries and returns exception strings.
Several UI renderers interpolate agent-controlled content into `innerHTML`,
creating an avoidable cross-site scripting boundary. External calls and
persisted agent outputs also lack consistent schema, size, timeout, and domain
validation.

## Scope

This change preserves the existing Flask and vanilla-JavaScript product while
replacing its planning core with a local ADK application. It implements four
project categories:

1. A multi-agent system built with ADK.
2. A local MCP server for weather and media retrieval.
3. A project-local travel-planning agent skill.
4. Security features backed by strict schemas, guardrails, tests, and STRIDE.

Deployment, cloud provisioning, authentication accounts, payments, and a
frontend rewrite are explicitly out of scope.

## Architecture

The Flask API remains the application boundary. It validates each request as a
strict `TripRequest`, then submits a normalized representation to the ADK
workflow. The workflow contains a coordinator, specialist agents, a media
enrichment stage, and a final validation/aggregation stage.

Independent specialist work runs concurrently through ADK workflow agents.
The implementation may preserve partial output when one specialist fails, but
must label the unavailable section and log a sanitized diagnostic event.

The MCP server exposes narrowly scoped tools for Open-Meteo geocoding and
forecasting and Wikimedia Commons media search. Tool inputs and outputs use
Pydantic models. External HTTP clients enforce HTTPS, explicit host allowlists,
timeouts, response-size limits, and bounded result counts.

## Agent Boundaries

- The coordinator determines the required specialist set and constructs the
  overall trip title and category.
- The location agent produces route nodes and valid geographic coordinates.
- The weather and clothing agent consumes real weather data and emits
  structured packing items with category and media-search query fields.
- The logistics agent returns lodging and transit suggestions.
- The cuisine agent returns dishes, restaurants, recipes, and a shopping list.
- The events agent returns attractions, events, and a daily agenda.
- The media enrichment stage searches by the complete entity name plus
  destination context. It returns a `MediaAsset` containing URL, source page,
  attribution, alt text, and search query.
- The aggregator validates the complete `TripResult` before storage and HTTP
  serialization.

The model never chooses or constructs an arbitrary image URL. When the MCP
tool cannot return an allowlisted, adequately relevant asset, `MediaAsset` is
absent and the UI displays an explicit placeholder.

## Data Flow

1. The browser sends trip configuration JSON to Flask.
2. Flask validates types, lengths, dates, list sizes, and accepted preference
   values using a strict Pydantic model.
3. The coordinator and ADK workflow execute specialist tasks.
4. MCP tools provide grounded weather and media data.
5. The aggregator validates partial agent results into one typed response.
6. SQLite stores only validated input, sanitized audit events, and validated
   result JSON.
7. Flask serializes a stable response contract.
8. The browser renders untrusted strings through `textContent` and DOM node
   construction. Media elements accept only backend-validated assets.

## Image and Clothing Correctness

Image retrieval uses the full entity and destination context instead of broad
client-side keyword buckets. Search results retain their source and
attribution. The UI provides source links where an image is shown.

Packing items become structured objects rather than raw strings. Each item has
a display name, normalized category, reason, quantity or usage guidance, and a
media query. Clothing recommendations derive from real forecast values and
trip activities. Tests validate categorization and URL policy; behavioral evals
assess semantic relevance because LLM and search results are nondeterministic.

## Security Design

The repository will include `.agents/CONTEXT.md` with the requested secure
coding standards. A travel-planning skill will add domain-specific rules for
date handling, factual uncertainty, dietary safety, media attribution, and
tool use.

Security controls include:

- Strict Pydantic request, tool, agent-output, and persistence schemas.
- No shell-execution tools in the agent runtime.
- Prompt/data delimiters and instructions that remote content is untrusted.
- HTTPS and hostname allowlists for media and weather services.
- Request timeouts, bounded concurrency, list/field limits, cache limits, and
  per-client API rate limiting.
- Safe DOM rendering and removal of model-controlled HTML interpolation.
- Generic client errors with structured, sanitized server-side logs.
- No secrets, complete prompts, chain-of-thought, or raw stack traces in logs.
- SQLite parameter binding and validated JSON at persistence boundaries.
- A root `threat_model.md` evaluating all STRIDE categories and documenting
  residual risks.

## Failure Handling

External service failures return typed unavailable results rather than
fabricated facts. The MCP layer distinguishes timeout, no-result, invalid
response, and policy-rejected URL conditions. A specialist failure does not
discard successful sections. Database failures prevent a false success
response. The API uses stable error codes while keeping internal details out
of the response.

## Structured Logging and Audit Trail

Every orchestration request receives a generated correlation identifier that
is returned to the browser and propagated through Flask, the ADK runner,
specialist agents, MCP tools, aggregation, and persistence. Logs use JSON
records with an allowlisted schema: timestamp, severity, event name,
correlation ID, component, agent or tool name, duration, outcome, and a stable
error code when applicable.

The application records workflow lifecycle events, tool start/completion,
timeouts, validation failures, specialist partial failures, persistence
results, and rate-limit decisions. It does not record API keys, authorization
headers, complete prompts, chain-of-thought, raw remote payloads, or full user
descriptions. User-originated values are redacted or summarized before being
attached to logs. Exception details remain local and are normalized before
logging so stack traces and filesystem paths do not cross the HTTP boundary.

Local logs rotate by size and retention count to prevent unbounded disk use.
The existing user-visible agent trace is derived from sanitized domain events,
not from internal reasoning. Tests verify correlation propagation, field
redaction, stable event shape, and rotation configuration.

## Testing and Evaluation

Deterministic unit tests cover request validation, date rules, tool schemas,
MCP response normalization, URL allowlisting, packing-item categorization,
database serialization, and safe frontend helpers. Integration tests exercise
Flask through the workflow boundary with controlled agent and MCP adapters.

LLM behavior is evaluated with ADK eval datasets, not brittle pytest assertions
over generated wording. Initial eval cases cover a Brazilian road trip and a
Milan business trip. Grading criteria cover required sections, dietary and
budget constraints, correct tool use, weather-aware clothing, entity-specific
media, graceful partial failure, and resistance to instructions embedded in
user or remote data.

## Acceptance Criteria

- `agents-cli info` recognizes the enhanced project.
- The planning runtime uses ADK coordinator and specialist agents.
- MCP tools are visible in agent traces and return validated Open-Meteo or
  Wikimedia data.
- The frontend contains no static keyword-to-photo decision table.
- Every displayed remote image has backend-provided context and attribution,
  or the UI shows a placeholder.
- The requested `.agents/CONTEXT.md` and root `threat_model.md` exist.
- Unit/integration tests, linting, and the initial ADK eval suite complete with
  documented results.
