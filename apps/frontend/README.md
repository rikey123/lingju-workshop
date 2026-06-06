# ScriptMind Frontend

This app implements the frontend workspace for the `novel-to-screenplay-platform` OpenSpec change.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- HeroUI v3 + Tailwind CSS v4
- TipTap / ProseMirror for screenplay block editing
- Zustand for workspace UI state
- TanStack Query for contract-driven data loading
- React Hook Form + Zod for import/export form validation
- dnd-kit for scene reordering
- cmdk for command palette actions

## Run

From the repository root:

```bash
npm install
npm run dev:frontend
```

The local app opens on the Next.js dev server URL printed by the command.

## Verify

```bash
npm run test:frontend:run
npm run build:frontend
```

## Current Scope

The frontend is implemented against local contract fixtures because the FastAPI backend is not implemented yet.

Completed frontend scope:

- Workspace shell with editor, outline, characters, read-only story graph, quality, export, and history views.
- Contract types for API envelopes, versioned resources, screenplay blocks, jobs, exports, assets, revisions, and validation issues.
- Screenplay block behavior for insert, split, convert, update, and scene reorder.
- TipTap editor surface for typed blocks.
- HeroUI tabs, cards, and buttons.
- dnd-kit scene reorder path.
- cmdk command palette.
- Fixture-backed autosave and conflict UI using the published API envelope.
- YAML/Fountain/PDF/DOCX/FDX export UI with YAML preview and source trace sidecar messaging.

Backend-dependent scope remains open:

- Real draft persistence beyond the fixture-backed contract mock.
- Real AI generation jobs.
- Real Fountain/PDF/DOCX/FDX rendering.
- Real validation and round-trip checks.
