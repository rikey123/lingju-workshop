## ADDED Requirements

### Requirement: Project creation from a novel source
The system SHALL allow a user to create a project from pasted text, uploaded text files, or existing source documents and store the project as the workspace root for all later drafts and exports.

The system SHALL require the imported novel source to contain at least three chapters before the platform allows full screenplay generation.

#### Scenario: Create a new project
- **WHEN** a user creates a new project from a novel source
- **THEN** the system SHALL create a project record, store the uploaded source, and initialize the first draft workspace

#### Scenario: Reject insufficient source material
- **WHEN** a user imports a novel that contains fewer than three chapters
- **THEN** the system SHALL block the full generation workflow and show a clear message that at least three chapters are required

### Requirement: Workspace dashboard visibility
The system SHALL provide a workspace dashboard that shows the current project, active draft, recent generation jobs, validation warnings, exported artifacts, and revision history entry points.

The system SHALL allow the user to resume work from the last opened view and selected filters.

#### Scenario: Open a project workspace
- **WHEN** a user opens an existing project
- **THEN** the system SHALL restore the most recent working context and show the current draft status, latest job state, and recent outputs

#### Scenario: Inspect workspace status
- **WHEN** the user views the workspace dashboard
- **THEN** the system SHALL display project metadata, draft count, export status, and unresolved warnings in one place

### Requirement: Draft lifecycle management
The system SHALL allow the user to create, duplicate, rename, lock, and restore screenplay drafts within a project.

The system SHALL store each draft as an independently versioned workspace document so users can compare alternate adaptation attempts.

#### Scenario: Duplicate a draft
- **WHEN** a user duplicates an existing draft
- **THEN** the system SHALL create a new draft with a new immutable identifier while preserving the source project linkage

#### Scenario: Restore a prior draft
- **WHEN** a user restores a previously saved draft version
- **THEN** the system SHALL create or expose a revision entry that preserves the older content and marks the current draft as derived from it

### Requirement: Revision history and compare
The system SHALL retain revision history for screenplay edits, AI-generated drafts, and exported artifacts that are tied to the project lifecycle.

The system SHALL support comparing two revisions and restoring the workspace to a selected revision snapshot.

#### Scenario: Compare revisions
- **WHEN** a user selects two revisions in the history view
- **THEN** the system SHALL show the differences in screenplay blocks, scene order, and key metadata

#### Scenario: Revert to revision
- **WHEN** a user chooses to revert to a previous revision
- **THEN** the system SHALL create a new revision that matches the selected snapshot and preserve the revert operation in history

### Requirement: Project asset library
The system SHALL maintain a project asset library for uploaded source files, generated exports, cover images, and intermediate artifacts.

The system SHALL make each asset downloadable and show its creation source, file type, size, and associated draft or job.

#### Scenario: Download a generated export
- **WHEN** a user opens the asset library and selects a PDF or DOCX export
- **THEN** the system SHALL provide the downloadable file together with its creation metadata

#### Scenario: Review source assets
- **WHEN** a user inspects uploaded source files
- **THEN** the system SHALL show which project and generation jobs consumed that source file

### Requirement: Workspace navigation between product views
The system SHALL provide navigation between editor, outline, characters, story graph, quality, export, and history views without forcing the user to leave the project workspace.

The system SHALL preserve the active draft context when the user switches between views.

#### Scenario: Switch from editor to outline
- **WHEN** a user switches from the screenplay editor to the outline view
- **THEN** the system SHALL keep the same project and draft selected and update only the active workspace view

#### Scenario: Return to editor context
- **WHEN** a user returns to the editor from another view
- **THEN** the system SHALL restore the same scene and block focus if the state still exists

## Reference Notes

- Beat informs revisions, backups, outline views, automatic scene numbering, and screenplay-centric project navigation.
- Trelby informs project management boundaries, comparison/report patterns, and import/export expectations.
