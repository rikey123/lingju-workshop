## ADDED Requirements

### Requirement: Chapter-based novel ingestion
The system SHALL accept novel text from pasted input or uploaded files and segment it into chapters, paragraphs, and source blocks suitable for downstream analysis.

The system SHALL require at least three chapters before it allows the full screenplay transformation pipeline to proceed.

#### Scenario: Parse a multi-chapter novel
- **WHEN** a user uploads a novel containing three or more chapters
- **THEN** the system SHALL identify chapter boundaries and preserve paragraph order for each chapter

#### Scenario: Guard against insufficient chapters
- **WHEN** a user uploads a source with fewer than three chapters
- **THEN** the system SHALL produce an ingestion warning and block full adaptation generation

### Requirement: Source trace preservation
The system SHALL attach source references to extracted entities and generated screenplay material so every meaningful output can be traced back to the novel source.

The system SHALL preserve chapter identifiers, paragraph ranges, and an adaptation classification for each source reference.

#### Scenario: Trace a generated scene
- **WHEN** the system generates a screenplay scene from one or more novel paragraphs
- **THEN** the scene SHALL retain references to the originating chapter and paragraph range

#### Scenario: Mark invented material
- **WHEN** the AI introduces a line or beat not present in the source text
- **THEN** the system SHALL mark the output as invented or inferred in the adaptation metadata

### Requirement: Character extraction and identity resolution
The system SHALL extract characters, aliases, roles, relationship hints, goals, and voice profiles from the source novel.

The system SHALL detect possible duplicate identities and surface merge candidates for review when multiple aliases likely refer to the same character.

#### Scenario: Extract recurring characters
- **WHEN** the parser encounters repeated names, nicknames, or honorifics
- **THEN** the system SHALL merge them into a single character candidate unless the data indicates separate identities

#### Scenario: Flag ambiguous identity matches
- **WHEN** two character mentions have conflicting attributes but similar names
- **THEN** the system SHALL keep them separate and surface a warning for manual review

### Requirement: Location, event, and thread modeling
The system SHALL extract locations, events, conflicts, and unresolved story threads from the source material and maintain them as structured entities.

The system SHALL connect those entities to characters and chapters through source references and relationship edges.

#### Scenario: Build location references
- **WHEN** a chapter repeatedly references the same place
- **THEN** the system SHALL create or update a location entity and link all relevant paragraphs to it

#### Scenario: Track unresolved threads
- **WHEN** the source novel introduces an unanswered mystery or open conflict
- **THEN** the system SHALL store it as a story thread with status metadata for downstream adaptation planning

### Requirement: Story graph generation
The system SHALL produce a story graph that represents the relationships among chapters, characters, locations, events, and story threads.

The system SHALL make the graph available to downstream generation stages and to the frontend story graph view.

#### Scenario: Export story graph data
- **WHEN** the ingestion pipeline completes entity extraction
- **THEN** the system SHALL expose a graph summary that the frontend can render as nodes and edges

#### Scenario: Use graph data for planning
- **WHEN** the screenplay planner runs
- **THEN** the system SHALL allow it to query the graph for character relationships, sequence continuity, and unresolved threads

### Requirement: Character memory accumulation
The system SHALL maintain a character memory profile that aggregates facts, motivations, constraints, voice traits, and continuity notes across the source novel and generated drafts.

The system SHALL keep character memory separate from the source text so later edits can refine or override it without losing provenance.

#### Scenario: Update character memory
- **WHEN** later chapters reveal new facts about a character
- **THEN** the system SHALL append or revise the character memory profile while preserving the original source reference

#### Scenario: Use memory in generation
- **WHEN** the dialogue or scene generation stage needs a character voice profile
- **THEN** the system SHALL retrieve the accumulated memory profile instead of re-deriving the character from scratch

### Requirement: Chunked processing and uncertainty reporting
The system SHALL process long novels in chunks so large source material can be ingested without losing chapter order or entity continuity.

The system SHALL report uncertain extractions, unresolved merges, and missing source spans as structured warnings instead of silently discarding them.

#### Scenario: Process a long novel
- **WHEN** the source novel contains many chapters or long chapters
- **THEN** the ingestion pipeline SHALL split the work into chunks and reassemble the results into one coherent project model

#### Scenario: Surface uncertainty
- **WHEN** the parser cannot confidently assign a paragraph to a character, location, or thread
- **THEN** the system SHALL preserve the ambiguous extraction and include a review warning in the ingestion summary

## Reference Notes

- screenplay-tools informs the use of a canonical internal model rather than binding ingestion to one file format.
- afterwriting-labs informs downstream screenplay analytics and derived quality outputs.
- scripttool informs conversion-oriented source handling and structured output expectations.
