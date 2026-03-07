# Codex Master Prompt

You are implementing the Scrambling app in this repository.

## Source of truth
Always follow these files, in this order:

1. `docs/product/mvp-scope.md`
2. `docs/architecture/target-architecture.md`
3. `docs/architecture/domain-model.md`
4. `docs/architecture/api-contract.md`
5. `docs/architecture/adrs.md`
6. `docs/development/testing-strategy.md`
7. `docs/development/verification-checklists.md`

## Working rules

- Stay inside MVP scope unless the prompt explicitly expands scope.
- Do not build on the legacy POC architecture.
- Keep the frontend and backend decoupled.
- Prefer small, composable modules over large files.
- Use strict TypeScript in the web app.
- Use FastAPI, SQLAlchemy 2.x, Alembic, and Pydantic v2 in the API.
- Add or update tests for all meaningful business logic.
- Update documentation whenever behavior, schema, routes, setup, or workflows change.
- Do not leave placeholder TODOs unless explicitly requested.
- Use clean names and predictable file organization.
- Optimize for correctness and maintainability over cleverness.

## Definition of complete for each task
At the end of every task, provide:

1. a concise summary of what changed
2. files added or modified
3. commands to install, run, lint, and test
4. manual verification steps
5. known risks, tradeoffs, or remaining gaps

## Guardrails

- Do not add auth, friends, social, achievements, notifications, or mobile app code unless the task explicitly requests them.
- Do not silently invent API fields or DB columns that are not supported by the docs or domain model.
- Enforce round locking consistently across all mutating operations.
- Keep generated examples and test fixtures realistic.
