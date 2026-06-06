## ADDED Requirements

### Requirement: Workflow-driven screenplay generation
The system SHALL generate screenplay drafts through a multi-stage workflow instead of a single monolithic completion request.

The system SHALL support at least outline generation, scene expansion, dialogue polishing, continuity checking, export preflight, and quality scoring as distinct workflow stages.

#### Scenario: Start a generation job
- **WHEN** a user requests screenplay generation from a novel source or existing draft
- **THEN** the system SHALL create a workflow job and execute the configured stages in order

#### Scenario: Capture stage outputs
- **WHEN** a workflow stage completes
- **THEN** the system SHALL store the intermediate output so later stages and retries can reuse it

### Requirement: Adaptation-aware generation modes
The system SHALL allow the user to choose an adaptation mode such as faithful, commercial, short-drama, cinematic, or free adaptation when starting a generation workflow.

The system SHALL use the selected adaptation mode to influence scene granularity, dialogue density, pacing, and rewrite aggressiveness.

#### Scenario: Generate in short-drama mode
- **WHEN** a user chooses the short-drama adaptation mode
- **THEN** the workflow SHALL favor faster scene turns, tighter dialogue, and stronger cliffhangers

#### Scenario: Generate in faithful mode
- **WHEN** a user chooses the faithful adaptation mode
- **THEN** the workflow SHALL preserve more source structure and keep rewrite aggressiveness lower

### Requirement: Job progress and resumability
The system SHALL expose stage-level progress, current state, and partial outputs for every generation job.

The system SHALL allow a job to resume from the last successful stage after failure or interruption.

#### Scenario: Poll job status
- **WHEN** the frontend checks an in-progress generation job
- **THEN** the backend SHALL return the current stage, progress estimate, and latest completed artifact

#### Scenario: Resume failed workflow
- **WHEN** a previous workflow fails after stage completion
- **THEN** the backend SHALL allow the next run to skip completed stages when the input context has not changed

### Requirement: Partial regeneration control
The system SHALL allow targeted regeneration of selected scenes, characters, story threads, or dialogue blocks without rebuilding the entire draft.

The system SHALL preserve unchanged blocks and maintain revision lineage for regenerated segments.

#### Scenario: Regenerate one scene
- **WHEN** a user requests regeneration for a single scene
- **THEN** the system SHALL update only the affected scene and keep unrelated scenes stable

#### Scenario: Regenerate dialogue only
- **WHEN** a user requests dialogue polishing for selected blocks
- **THEN** the system SHALL preserve the original scene structure and replace only the selected dialogue content

### Requirement: Provider abstraction and provenance
The system SHALL route model calls through a provider abstraction so multiple LLM vendors can be supported without changing workflow logic.

The system SHALL record the provider, model name, prompt version, input references, and output provenance for every generation stage.

#### Scenario: Switch model provider
- **WHEN** the backend runs the same workflow with a different provider
- **THEN** the workflow logic SHALL remain unchanged while the provider adapter changes beneath it

#### Scenario: Audit a generated scene
- **WHEN** a user inspects the provenance for a generated scene
- **THEN** the system SHALL show which provider, prompt version, and source references produced it

### Requirement: Human review checkpoints
The system SHALL support workflow checkpoints that pause execution for human review before committing a draft, exporting an artifact, or accepting a risky rewrite.

The system SHALL mark staged outputs as `needs_review` until the review is completed.

#### Scenario: Pause before finalization
- **WHEN** a workflow reaches a configured review checkpoint
- **THEN** the system SHALL stop the pipeline and surface the staged output for approval or revision

#### Scenario: Approve a checkpoint
- **WHEN** the user approves a staged generation result
- **THEN** the system SHALL advance the workflow and mark the output as approved

### Requirement: Structured quality and consistency reporting
The system SHALL produce structured warnings and scores for plot coherence, character consistency, dialogue naturalness, scene structure, source coverage, and adaptation risk.

The system SHALL surface unresolved plot holes, continuity gaps, and source coverage gaps as actionable review items.

#### Scenario: Run consistency checks
- **WHEN** the workflow completes continuity analysis
- **THEN** the system SHALL return a quality report with scores and list the warnings that require author attention

#### Scenario: Detect a plot hole
- **WHEN** a story thread is introduced but never resolved in the current draft
- **THEN** the system SHALL flag the issue in the quality report and link it to the relevant scenes or characters

## Reference Notes

- screenplay-tools informs the separation between parseable screenplay structure and workflow logic.
- afterwriting-labs informs derived analytics and quality-oriented feedback during review checkpoints.
- scripttool informs format conversion thinking and intermediate representation handling.
