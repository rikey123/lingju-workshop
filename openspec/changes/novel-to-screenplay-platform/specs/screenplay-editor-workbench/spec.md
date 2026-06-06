## ADDED Requirements

### Requirement: Typed screenplay block editor
The system SHALL render screenplay drafts as an ordered sequence of typed blocks and allow editing of the block content in place.

The system SHALL support the block types `scene_heading`, `action`, `character`, `dialogue`, `parenthetical`, `transition`, `note`, `beat`, and `separator` in the editor experience.

#### Scenario: Edit a dialogue block
- **WHEN** a user opens a draft in the editor and selects a dialogue block
- **THEN** the system SHALL allow direct editing of the block text while preserving the block identity and type

#### Scenario: Insert a new block
- **WHEN** a user inserts a new scene heading or action block
- **THEN** the editor SHALL create a typed block in the correct position in the screenplay order

### Requirement: Screenplay-specific editing actions
The system SHALL provide screenplay-specific editing actions for splitting, merging, converting, and reordering blocks.

The system SHALL expose these actions through the keyboard, toolbar controls, drag-and-drop interactions, and a command palette.

#### Scenario: Split a scene block
- **WHEN** a user splits a block at the cursor position
- **THEN** the system SHALL create two valid screenplay blocks and preserve source trace metadata on both blocks where possible

#### Scenario: Reorder a scene
- **WHEN** a user drags a scene block to a different position in the outline or editor
- **THEN** the system SHALL update the screenplay order and preserve scene identifiers and references

### Requirement: Outline and scene card views
The system SHALL provide an outline view that presents scenes as cards with metadata such as act, location, duration estimate, conflict level, and source trace.

The system SHALL allow scenes to be filtered, selected, and reordered from the outline view without leaving the project workspace.

#### Scenario: Inspect scene cards
- **WHEN** a user opens the outline view
- **THEN** the system SHALL display every scene card with its title, location, source chapter linkage, and current status

#### Scenario: Filter outline cards
- **WHEN** a user filters by character or act
- **THEN** the system SHALL show only the scene cards matching the active filter

### Requirement: Character and location sidebars
The system SHALL provide sidebars for characters, locations, and story threads that support search, filtering, and navigation to source traces.

The system SHALL let the user jump from a sidebar entity to the relevant screenplay blocks and source material.

#### Scenario: Open a character profile
- **WHEN** a user selects a character from the sidebar
- **THEN** the system SHALL show that character's relationships, appearances, and key dialogue scenes

#### Scenario: Jump to source
- **WHEN** a user clicks a source trace from a location or character entry
- **THEN** the editor SHALL navigate to the corresponding chapter paragraph or screenplay block

### Requirement: Revision mode and diff visualization
The system SHALL provide a revision mode that highlights edits between the current draft and a selected prior revision.

The system SHALL show added, removed, and modified screenplay blocks and allow the user to inspect the change history of a scene or block.

#### Scenario: Compare revisions in the editor
- **WHEN** a user opens a revision comparison
- **THEN** the editor SHALL highlight changed blocks and preserve the original and revised content for inspection

#### Scenario: View block history
- **WHEN** a user opens the history for a block
- **THEN** the system SHALL list prior values, timestamps, and authorship or generation source

### Requirement: Inline validation and correction
The system SHALL display validation markers directly in the editor for schema errors, missing required fields, source trace issues, and consistency warnings.

The system SHALL let the user navigate from each marker to the affected block and correct the issue inline.

#### Scenario: Missing required scene field
- **WHEN** a scene heading is missing required metadata or the backend returns a validation warning
- **THEN** the editor SHALL mark the affected block and explain what must be fixed

#### Scenario: Fix a validation error
- **WHEN** a user edits the highlighted block to resolve the error
- **THEN** the editor SHALL clear the marker after the updated data is successfully saved and validated

### Requirement: Autosave and conflict awareness
The system SHALL autosave editor changes to the active draft and keep the user informed when the local edit state diverges from the server version.

The system SHALL present a recoverable conflict flow rather than silently overwriting concurrent edits.

#### Scenario: Autosave a draft change
- **WHEN** a user pauses after editing a screenplay block
- **THEN** the editor SHALL persist the change automatically and update the local revision state

#### Scenario: Server conflict occurs
- **WHEN** the backend rejects an editor save because the draft version is stale
- **THEN** the editor SHALL show a conflict state and offer reload or merge actions

## Reference Notes

- Beat informs screenplay-first editing UX, scene numbering, revisions, outline tools, and minimal-distraction layout expectations.
- Trelby informs strict screenplay formatting boundaries, comparison/report patterns, and import/export behavior.
- xyflow-main informs node/edge interaction patterns for the future graph-oriented workspace view.
