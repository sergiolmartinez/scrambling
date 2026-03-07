# Prompt 03 - Core API

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

Implement the core MVP FastAPI routes and services.

## Routes to support

- create round
- get round aggregate
- add/edit/remove players
- search courses
- get course details
- assign course to round
- create or update hole score
- add contributions for a shot
- get contributions for a hole
- delete one contribution
- get leaderboard
- complete round
- get round summary

## Requirements

- use service layer separation
- validate inputs and business rules
- return stable response DTOs
- enforce round locking consistently
- add integration tests for critical flows
- update API docs and verification docs

## Output format

Include:

- endpoints implemented
- files changed
- run and test commands
- manual verification steps
