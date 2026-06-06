## ADDED Requirements

### Requirement: Multi-format screenplay import
The system SHALL import screenplay content from Fountain, YAML, and Final Draft-compatible FDX sources into the canonical internal screenplay model.

The system SHALL preserve scene ordering, block types, character names, and source trace information where the source format contains it.

#### Scenario: Import Fountain content
- **WHEN** a user imports a Fountain file
- **THEN** the system SHALL parse scene headings, action lines, character cues, dialogue, transitions, and notes into the internal block model

#### Scenario: Import FDX content
- **WHEN** a user imports an FDX file
- **THEN** the system SHALL map the XML screenplay structure into the same internal canonical document model used by the editor

### Requirement: Multi-format screenplay export
The system SHALL export the canonical screenplay model to YAML, Fountain, PDF, DOCX, and FDX.

The system SHALL use the same canonical document as the source of truth for every export target.

#### Scenario: Export to YAML
- **WHEN** a user chooses the YAML export action
- **THEN** the system SHALL produce a valid YAML document that conforms to the platform schema

#### Scenario: Export to PDF and DOCX
- **WHEN** a user exports the same draft to PDF and DOCX
- **THEN** the system SHALL preserve scene formatting, dialogue indentation, and page-oriented screenplay presentation rules in both outputs

### Requirement: Validation and round-trip checks
The system SHALL validate every generated or imported screenplay against the platform schema and report field-level issues before the user exports or finalizes the draft.

The system SHALL perform round-trip validation between the internal model and supported exchange formats to detect loss of information or structural drift.

#### Scenario: Reject invalid YAML
- **WHEN** a generated YAML file is missing required fields or violates the schema
- **THEN** the system SHALL report the exact validation errors and prevent the export from being marked as valid

#### Scenario: Detect round-trip drift
- **WHEN** a Fountain or FDX file is imported and then re-exported
- **THEN** the system SHALL compare the structural result and report any scene or block information that could not be preserved

### Requirement: Export job tracking and artifact delivery
The system SHALL create a tracked export job for every export request and expose its state until the downloadable artifact is ready.

The system SHALL provide the exported files together with metadata describing the source draft, export format, generation timestamp, and validation status.

#### Scenario: Track an export request
- **WHEN** a user starts a PDF export
- **THEN** the system SHALL create an export job and update its progress until the file is ready

#### Scenario: Download the result
- **WHEN** the export job succeeds
- **THEN** the system SHALL make the generated file available in the project asset library and expose a download link

### Requirement: Screenplay analytics and validation report
The system SHALL generate screenplay analytics including page count, scene count, dialogue distribution, character usage, and location balance as part of the export and validation workflow.

The system SHALL include these metrics in a structured report that the frontend can display alongside export results and quality feedback.

#### Scenario: Inspect screenplay metrics
- **WHEN** a user opens the validation report for a draft
- **THEN** the system SHALL show the scene, dialogue, character, and location metrics computed from the canonical screenplay model

#### Scenario: Highlight abnormal balance
- **WHEN** a draft has a very large imbalance in dialogue or scene density
- **THEN** the system SHALL flag the condition as a warning in the validation report

### Requirement: Source trace preservation across exports
The system SHALL preserve source trace metadata through formats that can represent it directly and SHALL emit a sidecar manifest when the target format cannot carry the metadata natively.

The system SHALL make the sidecar manifest downloadable with the exported artifact.

#### Scenario: Export with unsupported trace data
- **WHEN** a user exports to a format that cannot store chapter and paragraph references natively
- **THEN** the system SHALL generate a companion manifest that preserves the traceability data

#### Scenario: Preserve source links where possible
- **WHEN** the export format supports metadata or comments
- **THEN** the system SHALL embed the source references in the exported output instead of dropping them

## Reference Notes

- screenplain informs Fountain conversion and PDF/HTML/FDX export behavior.
- afterwriting-labs informs screenplay PDF generation and analytics/statistics output.
- scripttool informs Fountain/FDX/OSF interchange and JSON rendering.
- screenplay-tools informs the format-agnostic `Script` model that all exports should target.
- Beat and Trelby inform expected screenplay export/editing boundaries and professional workflow expectations.
