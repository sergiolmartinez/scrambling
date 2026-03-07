# Prompt 08 - Hardening and Release Prep

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

Harden the MVP without expanding product scope.

## Focus areas

- error handling consistency
- test coverage on edge cases
- cleanup of types and naming
- docs completeness
- CI reliability
- release checklist

## Do not add

- auth
- social
- achievements
- native mobile
- websockets

## Output format

Include:

- files changed
- final runbook
- release readiness summary
- remaining backlog items
