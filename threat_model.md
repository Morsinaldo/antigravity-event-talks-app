# TripOrchestrator Threat Model

## Scope

This model covers the local prototype: Browser UI, Flask API, Google ADK workflow,
local MCP server, Open-Meteo, Wikimedia Commons, JSON audit logs, and SQLite.
Cloud deployment, user accounts, booking, and payment processing are out of scope.

## System Boundaries

| Boundary | Untrusted input | Primary controls |
|---|---|---|
| Browser to Flask | Trip JSON and headers | Pydantic validation, limits, safe errors |
| Flask to ADK | Validated trip request | Typed models, data delimiters, correlation ID |
| ADK to MCP | Destination, dates, media query | Narrow tool list, Pydantic inputs, no shell |
| MCP to Open-Meteo | Fixed-endpoint parameters | HTTPS, timeout, response-size limit |
| MCP to Wikimedia Commons | Bounded entity query | Host allowlist, result and metadata validation |
| Flask to SQLite | Validated JSON | SQL parameters, transactions, defensive decoding |
| Application to logs | Lifecycle metadata | Field allowlist, redaction, rotation, correlation |

The local operator controls the machine and environment. Gemini, Open-Meteo,
and Wikimedia data are external and untrusted. Generated plans are advisory.

## Spoofing

Threats include forged request IDs, source addresses, media origins, or tool
identity. The prototype has no authenticated user identity. Request IDs are
correlation labels only, never authority. Media requires exact Wikimedia hosts
and a Commons source page. MCP tools are fixed at construction. Any process able
to call the local Flask port has equal privileges, so the server binds to
`127.0.0.1` by default.

## Tampering

Prompt injection may enter through trip descriptions or remote metadata. Agent
JSON, parameters, SQLite, and rendered DOM content may also be manipulated.
Strict Pydantic schemas reject unknown and out-of-range values; prompts label
external content as data; aggregation revalidates outputs; SQL is parameterized;
the frontend escapes model text and validates media hosts. A local user with
filesystem access can still alter SQLite and logs because they are not signed.

## Repudiation

Requests, tool calls, failures, and deletions may be disputed. JSON logs record
timestamp, severity, event, correlation ID, component, agent or tool, outcome,
duration, and stable error code. The response returns the same correlation ID.
Logs rotate at 2 MB with three backups. They remain local, mutable debugging
evidence rather than a cryptographic non-repudiation ledger.

## Information Disclosure

Keys, prompts, descriptions, stack traces, local paths, remote payloads, and
chain-of-thought could leak. Public errors use generic messages; audit events use
an explicit field allowlist and recursive redaction; agents are prohibited from
returning hidden instructions or reasoning. SQLite remains unencrypted, so users
must not enter passport, payment, health, or other sensitive personal data.

## Denial of Service

Risks include oversized input, repeated LLM calls, excessive MCP searches, slow
services, large remote payloads, and unbounded storage. Controls include field
and list bounds, a per-process request limiter, MCP result limits, eight-second
HTTP timeouts, two-megabyte response caps, limited history, and rotating logs.
The limiter resets on restart and LLM requests can still consume quota.

## Elevation of Privilege

Prompt injection may seek shell execution, arbitrary network access, file reads,
or privileged actions. Agents receive no shell, filesystem, booking, payment, or
generic fetch tools. MCP exposes only weather and Commons search, validates every
input with Pydantic, and calls fixed endpoints. Delete accepts an integer SQLite
ID and uses a parameterized statement. Operating-system access is outside this
application's authorization boundary.

## Residual Risks

- LLM and search relevance remain probabilistic; placeholders and attribution
  reduce but cannot eliminate semantic mismatch.
- Routes, prices, ratings, schedules, dietary claims, and events need user
  verification before consequential decisions.
- Authentication, encryption at rest, signed logs, distributed limits, and
  production monitoring are absent from this local prototype.
- External service contracts or licensing metadata may change.

## Security Verification

Run unit tests for schemas, URL policy, redaction, logging, MCP normalization,
database decoding, and frontend escaping. Run integration tests for Flask errors,
correlation, persistence, and rate limiting. Use ADK evals for prompt injection,
correct tool use, media attribution, and graceful partial failure.
