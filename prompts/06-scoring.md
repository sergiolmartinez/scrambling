# Prompt 06 - Scoring Flow

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

Implement the main scoring experience.

## Requirements

- show current hole
- navigate between holes
- create or update hole score
- add per-shot contributions
- support multiple players contributing on a shot
- delete individual contributions
- show running totals and latest leaderboard data
- add tests for critical scoring interactions

## Constraints

- keep the UI fast and easy on mobile
- do not add websocket or offline sync in this milestone

## Output format

Include:

- files changed
- test coverage added
- verification steps
