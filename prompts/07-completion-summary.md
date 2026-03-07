# Prompt 07 - Completion and Summary

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

Implement round completion, locked-state behavior, leaderboard screen, and summary screen.

## Requirements

- leaderboard route with ordered totals
- complete round action
- summary route and summary screen
- all mutating actions reject once completed
- locked-state UX is clear in the frontend
- integration and component tests added or updated
- docs updated

## Output format

Include:

- files changed
- manual verification steps
- known tradeoffs
