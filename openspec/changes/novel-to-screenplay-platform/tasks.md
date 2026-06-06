## 1. Shared foundations

- [ ] 1.1 Freeze the canonical screenplay document schema, API envelope, version token rules, and shared job state model
- [ ] 1.2 Create shared fixtures for projects, drafts, scenes, blocks, jobs, exports, and validation errors
- [ ] 1.3 Define contract tests that compare frontend expectations against backend response shapes

## 2. Backend foundation

- [ ] 2.1 Scaffold FastAPI app, SQLAlchemy models, Alembic migrations, and Pydantic DTO modules
- [ ] 2.2 Implement project, draft, revision, asset, job, and export persistence models
- [ ] 2.3 Implement stable API envelope, error model, pagination model, and versioned mutation handlers
- [ ] 2.4 Add Redis + ARQ worker bootstrap and job state persistence
- [ ] 2.5 Add structured logging, tracing hooks, and backend health endpoints

## 3. Ingestion and AI workflows

- [ ] 3.1 Implement novel chapter parsing, paragraph segmentation, and source trace extraction
- [ ] 3.2 Implement character, location, event, and story thread extraction with uncertainty reporting
- [ ] 3.3 Implement story graph and character memory generation
- [ ] 3.4 Implement LangGraph stages for outline generation, scene expansion, dialogue polishing, and continuity checking
- [ ] 3.5 Implement generation job status, progress reporting, resume behavior, and checkpoint review states

## 4. Editor and workspace frontend

- [ ] 4.1 Scaffold Next.js workspace shell, route structure, and HeroUI layout system
- [ ] 4.2 Implement TipTap screenplay schema and typed block editing behavior
- [ ] 4.3 Implement outline view, character view, story graph view, quality view, export view, and history view
- [ ] 4.4 Implement Zustand workspace state, TanStack Query data fetching, and autosave flows
- [ ] 4.5 Implement command palette, drag-and-drop scene ordering, and inline validation markers

## 5. Export, validation, and interoperability

- [ ] 5.1 Implement Fountain import and export against the canonical screenplay model
- [ ] 5.2 Implement YAML export with schema validation and source trace sidecar output
- [ ] 5.3 Implement PDF rendering through HTML/CSS + Playwright
- [ ] 5.4 Implement DOCX export using the canonical screenplay model
- [ ] 5.5 Implement FDX export/import mapping and round-trip validation

## 6. Two-person integration and verification

- [ ] 6.1 Wire frontend pages to backend APIs with the published contract fixtures
- [ ] 6.2 Add end-to-end tests for import, generation, editing, revision history, and export
- [ ] 6.3 Add contract tests for list endpoints, mutation conflicts, job polling, and validation errors
- [ ] 6.4 Validate the full happy path from 3+ chapter import to editable screenplay to downloadable exports
- [ ] 6.5 Encode the approved v1 defaults in implementation: SQLite local mode, FDX/PDF/DOCX/YAML same-release exports, read-only story graph, and fixed quality weights
