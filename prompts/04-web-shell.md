# Prompt 04 - Web Shell

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

Implement the web shell for the Scrambling MVP.

## Requirements

Use:

- Vite
- React
- TypeScript
- React Router
- Zustand
- TanStack Query
- Tailwind
- shadcn/ui
- React Hook Form
- Zod

## Goals

- app layout and navigation
- route modules for setup, scoring, leaderboard, and summary
- API client integration
- loading, error, and empty states
- test scaffolding for key routes and components

## Constraints

- no auth
- no mobile app code yet
- no achievements or social features

## Output format

Include:

- files changed
- commands to run web app and tests
- manual verification steps
