## Context

This change defines a full-platform product for converting 3+ chapter novels into editable screenplay drafts. The project is intentionally broad: it includes novel ingestion, entity modeling, screenplay generation, a structured screenplay editor, export/import validation, revision history, quality scoring, and long-running AI orchestration.

The repository currently contains design documents and reference projects, but no implemented application skeleton. The implementation therefore needs a clean product architecture rather than a small incremental patch.

The team size is two people, so the design must allow parallel work without tight cross-dependencies:

- Person A: frontend workspace, editor UX, client state, contract integration.
- Person B: backend models, AI workflow, persistence, export/import, validation, observability.

## Goals / Non-Goals

**Goals:**

- Deliver a single version that covers the entire main user journey from novel ingestion to screenplay export.
- Use Next.js 15, HeroUI, TipTap/ProseMirror, Zustand, TanStack Query, React Hook Form, Zod, dnd-kit, and cmdk on the frontend.
- Use FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, LangGraph, Redis + ARQ, and PostgreSQL on the backend.
- Preserve SQLite as a local development and offline fallback mode.
- Define a canonical internal screenplay document model that is not YAML-bound.
- Establish a strong frontend-backend contract that supports independent implementation and contract testing.
- Preserve source traceability from screenplay output back to chapters and paragraphs.
- Support import/export in Fountain, YAML, PDF, DOCX, and FDX in the same release.
- Support revision history, partial regeneration, quality scoring, and job tracking in the same product.

**Non-Goals:**

- Building a full commercial collaboration system with real-time multi-user concurrent editing in v1.
- Building a Neo4j-based graph backend in v1.
- Making YAML the only persisted primary format.
- Over-optimizing for every downstream format at the expense of the canonical document model.
- Splitting the product into separate services beyond the main web app, API app, worker, and storage.

## Decisions

### 1. Canonical storage is structured JSON plus relational metadata, not YAML

**Decision:** Store the editable draft as a canonical structured document in JSON form, with relational tables for project, revision, job, and asset metadata. YAML is an export/interop format, not the source of truth.

**Why:** YAML is readable for authors and useful as an exchange format, but it becomes fragile as the primary persistence layer once we add revision history, partial regeneration, validation, and multiple export targets. A structured document makes block-level edits, diffing, autosave, and conflict handling much safer.

**Alternatives considered:**

- Pure YAML storage: simpler to inspect, but weak for partial updates and revision tracking.
- Pure relational block model: strong for querying, but too rigid for the editor and AI output pipeline.
- Hybrid JSON document + relational metadata: best balance for editing, lineage, and export.

### 2. TipTap/ProseMirror handles the editor, but the document schema is screenplay-specific

**Decision:** Build a custom ProseMirror schema for screenplay block types rather than using a general-purpose rich text schema.

**Why:** The product must preserve screenplay semantics such as scene headings, character cues, dialogue blocks, parentheticals, transitions, beats, and separators. A generic editor will fight these constraints, while a screenplay-specific schema allows keyboard shortcuts, validation, and block conversion behavior to stay consistent.

**Alternatives considered:**

- Generic rich text editor: faster to prototype, but weak on screenplay semantics.
- Plain textarea with formatting helpers: easy to build, but poor editing experience and difficult validation.
- Custom ProseMirror schema: more work, but aligned with the product domain and the reference apps.

### 3. LangGraph is the orchestration layer for AI workflows

**Decision:** Use LangGraph to model the generation pipeline as a set of explicit stages and checkpoints rather than a single chat endpoint.

**Why:** The product needs outline generation, scene expansion, dialogue polishing, continuity checks, quality scoring, export preflight, and human review checkpoints. LangGraph gives stage boundaries, retries, and resumability, which are hard to maintain in one monolithic endpoint.

**Alternatives considered:**

- Single `/generate` endpoint: too opaque and too hard to resume.
- A chain of ad hoc background tasks: workable short term, but brittle and hard to observe.
- LangGraph workflow: best fit for multi-stage generation with stage outputs and checkpoints.

### 4. PostgreSQL is the target schema, SQLite is only a development fallback

**Decision:** Design the data model for PostgreSQL first, while allowing SQLite locally for developer convenience if needed.

**Why:** The product has multiple linked entities, revision history, job tracking, and export metadata. PostgreSQL is the correct long-term schema target and keeps the path open for multi-user and hosted deployments.

**Alternatives considered:**

- SQLite only: fine for local demo, but not ideal for the stated product scope.
- PostgreSQL only with no dev fallback: cleaner technically, but less convenient for two-person implementation.
- PostgreSQL target with SQLite-compatible local mode: best balance.

### 5. Redis + ARQ handles long jobs

**Decision:** Use Redis + ARQ for generation and export jobs rather than FastAPI background tasks or Celery.

**Why:** Generation and export are long-running, stage-based, and observable. FastAPI background tasks are too weak for job lifecycle management. Celery is heavier than necessary for the first version.

**Alternatives considered:**

- FastAPI BackgroundTasks: too limited.
- Celery: robust, but too much operational overhead for v1.
- ARQ: lightweight enough for v1 while still supporting queued work and retries.

### 6. Frontend and backend contracts are typed and versioned

**Decision:** Expose a stable API envelope, typed DTOs, pagination metadata, a shared job state model, and version tokens on mutable resources.

**Why:** Two people need to work independently. The frontend cannot wait on backend internals, and the backend cannot assume UI behavior. A versioned contract plus contract tests protects both sides from drift.

**Alternatives considered:**

- Implicit JSON shapes: too fragile.
- Open-ended payloads: easy initially, hard to maintain.
- Explicit Pydantic DTOs + documented envelopes: safest choice for parallel development.

### 7. The product uses a “one app, many views” workspace

**Decision:** Treat the product as a single project workspace with multiple views: editor, outline, characters, story graph, quality, export, and history.

**Why:** The workflow is one continuous creative process. Splitting it into separate tools creates context loss and makes the contract harder to maintain.

**Alternatives considered:**

- Separate apps for editor, graph, export: unnecessary fragmentation.
- One dashboard only: insufficient for real editing.
- Single workspace with view switching: best for continuity and shared state.

### 8. FDX ships with the first export release

**Decision:** FDX is not a later-phase export format. It ships in the same release as YAML, PDF, and DOCX.

**Why:** The product is explicitly targeting screenplay authors and downstream screenplay tooling. If the platform can already render and validate screenplay structure, delaying FDX creates an artificial gap between draft creation and professional handoff.

**Alternatives considered:**

- Delay FDX to a later milestone: simpler for implementation, but weaker for screenplay users.
- Ship only YAML/PDF first: reduces scope, but does not satisfy the stated product goal.
- Ship YAML/PDF/DOCX/FDX together: higher implementation load, but matches the product promise.

### 9. Story graph is read-only in v1 and quality weights are fixed

**Decision:** The first version exposes the story graph as an inspectable and navigable view, not an editable canvas. Quality scoring weights are fixed in code for v1 rather than project-configurable.

**Why:** Editable graph operations and configurable scoring both add complexity without increasing the core success path. The product already needs to ship the full ingestion, generation, editor, and export loop. Keeping the graph read-only preserves the review value while avoiding a second editing surface.

**Alternatives considered:**

- Editable graph in v1: powerful, but too much interaction complexity for the first release.
- Configurable scoring weights in v1: flexible, but unnecessary until we have real user feedback.
- Read-only graph with fixed scoring: the safest way to land the first release.

## Architecture

```text
Browser / Next.js App Router
  - workspace shell
  - screenplay editor
  - outline / characters / graph / export / history views
  - client state, cache, local validation
        |
        | typed HTTPS JSON contract
        v
FastAPI API service
  - projects, drafts, revisions, assets
  - ingestion endpoints
  - screenplay document reads/writes
  - job submission and status
  - export and validation orchestration
        |
        | enqueue / read status
        v
Redis + ARQ worker
  - novel ingestion
  - entity extraction
  - story graph construction
  - screenplay generation stages
  - export rendering and validation
        |
        v
PostgreSQL + object storage
  - project metadata
  - document snapshots
  - revisions
  - jobs
  - exports / source uploads
```

## Data Model

### Core entities

- `Project`: top-level workspace root for one novel and its adaptation outputs.
- `Draft`: an editable screenplay document derived from a project.
- `Scene`: a logical scene unit inside a draft.
- `ScriptBlock`: typed screenplay block inside a scene or ordered document stream.
- `Character`: canonical character identity with aliases, roles, voice profile, and memory.
- `Location`: canonical place entity linked to scenes and source paragraphs.
- `StoryThread`: unresolved or evolving narrative thread.
- `Revision`: immutable snapshot of document state after an edit, AI run, or restore.
- `GenerationTask`: one AI workflow execution with stage progress and outputs.
- `ExportJob`: one export execution with format, status, validation result, and artifact location.
- `Asset`: uploaded source file, export file, cover image, or intermediate artifact.

### Canonical screenplay document

The canonical editable document should be structured around ordered blocks rather than freeform text. A scene contains:

- heading metadata
- source references
- summary and dramatic purpose
- characters present
- continuity notes
- an ordered list of screenplay blocks

Each `ScriptBlock` should carry:

- stable block ID
- type
- text payload
- optional speaker/parenthetical data
- source references
- provenance
- edit state
- validation state

## API Contract

### Response envelope

Every API response should use a stable envelope:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

### Error envelope

```json
{
  "data": null,
  "meta": {
    "traceId": "string"
  },
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": {
      "field": "reason"
    }
  }
}
```

### Key resource endpoints

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/{projectId}`
- `POST /api/projects/{projectId}/import`
- `GET /api/projects/{projectId}/workspace`
- `GET /api/projects/{projectId}/drafts/{draftId}`
- `PATCH /api/projects/{projectId}/drafts/{draftId}`
- `POST /api/projects/{projectId}/drafts/{draftId}/generate`
- `GET /api/jobs/{jobId}`
- `POST /api/projects/{projectId}/exports`
- `GET /api/exports/{exportJobId}`
- `GET /api/projects/{projectId}/assets`
- `GET /api/projects/{projectId}/story-graph`
- `GET /api/projects/{projectId}/quality`
- `GET /api/projects/{projectId}/history`

### Contract rules

- All mutable resources must include a version token.
- All job endpoints must expose state, stage, progress, and output references.
- All list endpoints must paginate.
- All validation endpoints must return field-level error details.
- All draft mutations must preserve block IDs unless the user explicitly replaces or splits content.

## Frontend Design

### Main views

- Workspace shell
- Import flow
- Screenplay editor
- Outline view
- Characters view
- Story graph view
- Quality view
- Export view
- Revision history view

### Editor behavior

- TipTap/ProseMirror schema must enforce screenplay block types.
- Dnd-kit handles scene card reorder and outline drag interactions.
- Cmdk provides command palette actions for insert/split/merge/convert/regenerate/export.
- Zustand stores workspace UI state, active project, active draft, and unsaved edits.
- TanStack Query manages server state and job polling.
- React Hook Form + Zod manages import forms, export options, and review dialogs.

### Frontend data flow

1. Load project workspace metadata.
2. Fetch current draft and auxiliary views.
3. Edit locally with autosave and optimistic updates.
4. Poll generation/export jobs.
5. Render validation markers and revision diffs.
6. Submit exports and job requests through typed API calls.

## Backend Design

### Service structure

- `api`: FastAPI routes, request validation, response shaping.
- `domain`: project, draft, scene, character, and job models.
- `orchestration`: LangGraph workflows and stage definitions.
- `persistence`: SQLAlchemy models, repositories, migrations.
- `workers`: ARQ job handlers for ingestion, generation, export, validation.
- `adapters`: LLM providers, Fountain/FDX parsers, PDF/DOCX renderers.
- `observability`: structured logging, OpenTelemetry, Sentry hooks.

### Workflow stages

1. Novel ingestion and chapter segmentation.
2. Entity extraction and source trace construction.
3. Story graph and character memory build.
4. Outline generation.
5. Scene expansion.
6. Dialogue and action polishing.
7. Continuity and quality checks.
8. Export preflight and artifact render.

### Persistence and export

- Store canonical drafts and snapshots in the database.
- Store binary artifacts in object storage or a local file store.
- Keep generated manifests for formats that cannot preserve trace metadata.

## Frontend-Backend Boundary

The frontend owns:

- editor interaction model
- command palette and shortcuts
- local selection, focus, and visual state
- user-initiated requests
- presentation of validation and progress states

The backend owns:

- canonical document truth
- all AI workflows
- all validation logic that affects persisted state
- all export generation
- all source trace and provenance data

The boundary rule is simple:

- the frontend can propose edits and run local formatting/interaction logic
- the backend decides what is persisted, generated, validated, and exported

## Two-Person Work Split

### Person A: Frontend

Owns:

- Next.js app shell and routes
- HeroUI design system integration
- TipTap screenplay schema and editor commands
- outline, characters, graph, quality, export, and history views
- client state and autosave
- contract integration and E2E tests

### Person B: Backend

Owns:

- FastAPI API structure
- Pydantic DTOs and OpenAPI alignment
- database schema and migrations
- ingestion pipeline and entity extraction
- LangGraph workflows and ARQ jobs
- import/export/render/validation pipeline
- observability and backend tests

### Shared ownership

- API contract definitions
- canonical document model
- validation rules
- sample fixtures and contract tests

### Parallelization rule

The frontend can start as soon as the contract envelope, DTOs, and initial mock fixtures are published. The backend can start as soon as the shared model and endpoint list are frozen.

## Risks / Trade-offs

- [Scope risk] → Mitigation: keep the v1 workflow broad but define a single canonical path through the product; defer only real-time collaboration and Neo4j.
- [Contract drift] → Mitigation: publish shared DTOs, fixture payloads, and contract tests early.
- [Editor complexity] → Mitigation: restrict the editor to screenplay-specific block types rather than a generic rich-text surface.
- [Workflow brittleness] → Mitigation: use explicit LangGraph stage outputs and resumable jobs.
- [Export fidelity gaps] → Mitigation: use the canonical document as the single source for all exports and add round-trip tests.
- [Two-person bottleneck] → Mitigation: freeze the shared contract before deep implementation and keep the frontend/back-end ownership boundaries strict.

## Migration Plan

1. Initialize the repository structure for the frontend app, backend app, shared contract package, and worker service.
2. Introduce the canonical document model and API envelope.
3. Implement project creation, novel ingestion, and draft loading.
4. Implement the screenplay editor and workspace shell.
5. Implement AI generation jobs and quality checks.
6. Implement Fountain, PDF, DOCX, and YAML export.
7. Implement revision history, history diff, and asset library.
8. Add contract tests and end-to-end validation.

Rollback strategy:

- Keep YAML as an export target even if canonical storage changes.
- Store revision snapshots so a bad migration can restore an earlier draft state.
- Keep export artifacts immutable so earlier outputs remain downloadable.

## Open Questions

- None for the current release-policy decisions. SQLite local mode stays, FDX ships with PDF/DOCX/YAML, the story graph is read-only in v1, and quality weights are fixed in code for v1.

## Reference Mapping

| Area | Reference projects | What we borrow |
|---|---|---|
| Workspace and screenplay editor UX | Beat, Trelby | outline behavior, scene numbering, formatting boundaries, compare/revision concepts |
| Canonical screenplay model and interchange | screenplay-tools, scripttool | format-agnostic `Script` model, Fountain/FDX parsing, JSON conversion |
| Export and screenplay analytics | screenplain, afterwriting-labs | Fountain export behavior, PDF rendering, screenplay metrics and statistics |
| Graph-style workspace interaction | xyflow-main | node/edge canvas interaction patterns for future graph views |
