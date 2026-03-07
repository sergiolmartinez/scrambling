# Prompt 05 - Round Setup Flow

You are implementing the Scrambling app in this repository.

Follow these files as the source of truth:

- docs/product/mvp-scope.md
- docs/architecture/target-architecture.md
- docs/architecture/domain-model.md
- docs/architecture/api-contract.md
- docs/development/codex-master-prompt.md

Constraints:

- Stay strictly within MVP scope
- Keep frontend and backend decoupled
- Prefer clean, composable modules
- Use strict typing
- Add or update tests for business logic
- Update docs affected by your changes
- Do not leave placeholder TODOs
- Do not refactor unrelated files
- Preserve any legacy POC code unless explicitly told to move it

After completing the task, provide:

1. Files changed
2. Commands to install dependencies
3. Commands to run the app
4. Commands to run tests
5. Manual verification steps
6. Known risks or follow-up items

Implement the user flow for creating a round, selecting a course, and adding players.

## Requirements

- create round from UI
- search and assign course
- add, edit, and remove players
- enforce max 4 players in UI and API
- route cleanly into scoring flow
- add component and route tests where meaningful
- update verification docs

## UX expectations

- mobile-friendly layout
- clear button hierarchy
- helpful validation errors
- preserve server state across refresh

## Output format

Include:

- files changed
- verification steps
- remaining UX or API gaps
