## ADDED Requirements

### Requirement: Stable API envelope and error model
The system SHALL expose all backend API responses through a stable JSON envelope with explicit `data`, `meta`, and `error` fields so the frontend can handle success, warnings, and failures consistently.

The system SHALL return structured validation and runtime errors with a machine-readable error code, a human-readable message, an optional field-level details object, and a trace identifier.

#### Scenario: Successful API response
- **WHEN** the frontend requests a project or draft resource successfully
- **THEN** the backend SHALL return the resource in the `data` field and include any pagination or version metadata in `meta`

#### Scenario: Validation failure
- **WHEN** a request fails schema validation
- **THEN** the backend SHALL return `error.code`, `error.message`, and `error.details` that identify the invalid fields

### Requirement: Canonical identity and versioning
The system SHALL assign immutable identifiers to projects, drafts, scenes, blocks, characters, locations, story threads, revisions, generation tasks, and export jobs.

The system SHALL include a monotonically increasing or otherwise comparable version token on mutable resources so the frontend can detect stale edits and reconcile conflicts.

#### Scenario: Resource update
- **WHEN** a user edits a draft or scene block
- **THEN** the backend SHALL preserve the resource ID and advance the version token for the updated resource

#### Scenario: Stale client edit
- **WHEN** the frontend submits an update with an older version token than the server currently stores
- **THEN** the backend SHALL reject the update with a conflict response that includes the server version token

### Requirement: Shared screenplay document model
The system SHALL represent a screenplay draft as a structured document containing ordered screenplay blocks, scene metadata, source references, and block-level edit state.

The system SHALL support the block types `scene_heading`, `action`, `character`, `dialogue`, `parenthetical`, `transition`, `note`, `beat`, and `separator` as first-class values in the shared contract.

The system SHALL preserve source references on generated or edited blocks using chapter identifiers, paragraph ranges, and an adaptation type.

#### Scenario: Load a draft document
- **WHEN** the frontend requests a draft document for editing
- **THEN** the backend SHALL return the ordered block tree together with scene metadata and source references for each block that has traceability

#### Scenario: Update a screenplay block
- **WHEN** the frontend sends a block edit for a dialogue or scene heading
- **THEN** the backend SHALL accept the typed block payload and keep the block type stable unless the user explicitly converts it

### Requirement: Shared job state model
The system SHALL represent long-running generation and export work as jobs with a consistent state model that includes queued, running, waiting_review, succeeded, failed, and canceled.

The system SHALL expose stage progress, stage output references, and terminal error details for each job.

#### Scenario: Generation progress
- **WHEN** the backend is processing a generation workflow
- **THEN** the frontend SHALL be able to poll the job and read the current stage, progress percentage, and last completed artifact

#### Scenario: Job failure
- **WHEN** a generation or export job fails
- **THEN** the backend SHALL return the failure reason, the failing stage, and any partial outputs that can be reused for retry

### Requirement: List, filter, and paginate consistently
The system SHALL return paginated list responses using a consistent metadata structure that includes total count, page, page size, and sort information.

The system SHALL support filtering and sorting across the primary collections used by the workspace, including projects, drafts, scenes, characters, jobs, and exports.

#### Scenario: Project list query
- **WHEN** the frontend requests the project list with a status filter and page size
- **THEN** the backend SHALL return only matching projects and include pagination metadata for the current page

#### Scenario: Scene list query
- **WHEN** the frontend requests scenes filtered by act or character
- **THEN** the backend SHALL return the matching scenes in deterministic sort order

### Requirement: Conflict-safe patch semantics
The system SHALL support partial updates to mutable resources using patch semantics that allow the frontend to update only changed fields without rewriting unrelated data.

The system SHALL detect concurrent edits and preserve the last committed server state for recovery or merge.

#### Scenario: Partial draft update
- **WHEN** the frontend updates only a draft title or one block inside the document
- **THEN** the backend SHALL persist only the changed fields and keep unrelated blocks, metadata, and source references intact

#### Scenario: Merge after conflict
- **WHEN** the frontend receives a conflict response
- **THEN** the frontend SHALL be able to fetch the server version and present a merge or reload option to the user

## Reference Notes

- screenplay-tools informs the canonical `Script`/`Element` style boundary used by the shared contract.
- scripttool informs the Fountain/FDX interchange and JSON conversion contract surface.
