# Agent Work Manual

This repository is run with an OpenSpec-first workflow. The active OpenSpec change set under `openspec/changes/novel-to-screenplay-platform/` is the source of truth for scope, shared contracts, acceptance criteria, and implementation order.

If the spec is missing, stale, or ambiguous, stop and update the spec before coding.

## Non-Negotiable Rules

- Never work directly on `main`.
- Never share one worktree between multiple agents.
- Never start implementation without reading the relevant OpenSpec docs and tasks.
- Never mix unrelated changes in one commit.
- Never bypass PR review with a direct push to a protected branch.
- Never merge a PR before Oracle Agent approval.
- Human review is not a required merge gate.
- All pushes must go to the SSH remote `origin`.

## Repository Workflow

Every task follows the same path:

1. Sync to the latest `origin/main`.
2. Create or select a dedicated worktree for the task.
3. Create a branch scoped to one logical change.
4. Implement in small, testable increments.
5. Commit atomically.
6. Push the branch to `origin` over SSH.
7. Open a PR.
8. Request Oracle Agent review.
9. Fix review feedback, rerun tests, and request re-review.
10. Merge only after Oracle approval and passing checks.
11. Delete the branch and clean up the worktree after merge.

Recommended branch naming:

- `feat/<area>-<slug>`
- `fix/<area>-<slug>`
- `docs/<area>-<slug>`
- `chore/<area>-<slug>`

## Worktree Policy

Use a separate worktree for each active agent and each active task.

- Frontend work gets its own worktree and branch.
- Backend work gets its own worktree and branch.
- Shared contract work gets its own worktree and branch.
- Do not reuse another agent's worktree unless ownership has been explicitly handed over.
- Do not modify files in a worktree that belongs to another task.

If a task touches the shared API or data contract, land or freeze the contract first. Frontend and backend implementation may then proceed in parallel against that frozen contract.

Recommended split for this project:

- Frontend agent: Next.js, HeroUI, TipTap/ProseMirror, Zustand, TanStack Query, forms, editor UX, and UI tests.
- Backend agent: FastAPI, Pydantic, SQLAlchemy, Alembic, LangGraph, job orchestration, exports, imports, validation, and backend tests.
- Contract owner: OpenSpec docs, fixture payloads, DTO shape alignment, and contract tests.

## OpenSpec Discipline

OpenSpec is the boundary between product decisions and implementation.

- Read the current proposal, design, tasks, and relevant spec files before coding.
- Treat the spec as authoritative when behavior is unclear.
- Do not invent new API shapes, document structures, or workflow states unless the spec has been updated first.
- If implementation reveals a missing requirement, update the spec in the same change stream before landing code.
- If you rely on behavior from a reference project, note the project name in the PR description and any design notes.

## Atomic Commit Policy

Every commit must represent one coherent change.

- One commit should be easy to review and easy to revert.
- A commit may include code, tests, and docs if they are all required for the same change.
- Do not combine frontend and backend work in one commit unless the change is a single inseparable contract update.
- Do not add unrelated formatting or cleanup in the same commit.
- Prefer conventional commit messages, for example:
  - `feat(editor): add screenplay block schema`
  - `fix(api): reject stale draft updates`
  - `docs(agent): define review workflow`

Before each commit:

- Run the smallest relevant test for the change.
- Run any additional checks needed to prove the commit is safe.
- Inspect the diff for accidental file drift.

## PR Policy

Each PR should map to one logical unit of work.

Required PR content:

- What changed.
- Why it changed.
- Which OpenSpec files define the behavior.
- Which reference projects informed the implementation, if any.
- How the change was tested.
- Screenshots, exports, or sample payloads when the change affects UI or interchange formats.
- Any follow-up work or known limitations.

PR rules:

- Push the branch to `origin` with SSH.
- Open the PR against `main`.
- Keep PR scope tight.
- Do not hide unrelated work inside the PR.
- If the PR is not ready for review, mark it as draft instead of asking for premature approval.

## Oracle Agent Review Gate

Oracle Agent is the required blocking reviewer for this repository.

- No PR may be merged before Oracle Agent approval.
- Oracle Agent checks spec alignment, contract compatibility, test coverage, and release risk.
- If Oracle Agent requests changes, make them on the same branch, rerun tests, and request another review.
- Human approval is optional and does not block merge.

If Oracle Agent is unavailable, do not substitute a human review as a replacement gate. Wait for Oracle review or resolve the availability issue first.

## Merge Policy

After Oracle approval:

- Verify the latest CI results are green.
- Merge immediately or enable GitHub auto-merge if the repository supports it.
- Default merge strategy is squash merge unless the branch history must be preserved for a specific reason.
- Do not wait for human sign-off.
- Delete the remote branch after merge.
- Clean up the local worktree after merge.

Do not merge if any of the following are true:

- Oracle Agent has not approved the PR.
- The latest checks are failing.
- The spec and implementation diverge.
- The PR still contains unresolved review comments that affect correctness.

## Parallel Development Rules

The project is designed for two-person parallel delivery.

- One person owns the frontend track.
- One person owns the backend track.
- Shared contract changes must be frozen before the two tracks diverge.
- If a feature requires both frontend and backend work, land the contract first, then implement each side in parallel, then do a final integration PR if needed.

When parallel work is active:

- Keep branch names and worktree names clearly tied to the owner and task.
- Avoid touching shared files unless the task explicitly owns them.
- Communicate contract changes through OpenSpec, not through ad hoc code edits.

## Minimum Done Definition

A task is not done until all of the following are true:

- The code is committed atomically.
- The branch is pushed to `origin` over SSH.
- The PR is open.
- Oracle Agent has reviewed and approved it.
- The required tests have passed.
- The branch has been merged or is ready for auto-merge with no remaining blockers.

## Practical Default

When in doubt:

1. Read OpenSpec first.
2. Create a clean worktree.
3. Make one logical change.
4. Commit atomically.
5. Push over SSH.
6. Open a PR.
7. Wait for Oracle Agent.
8. Merge after Oracle approval.

