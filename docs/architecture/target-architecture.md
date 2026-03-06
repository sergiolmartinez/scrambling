# Target Architecture

## Recommended repo structure

```text
scrambling/
  README.md
  .editorconfig
  .gitignore
  .github/
    workflows/
  apps/
    api/
      app/
      alembic/
      tests/
      pyproject.toml
      README.md
    web/
      src/
      public/
      tests/
      package.json
      README.md
  packages/
    api-client/
    shared-types/
  docs/
    product/
    architecture/
    development/
    plan/
  infra/
    docker/
    compose/
```

## Architectural principles

1. Backend and frontend are decoupled.
2. API contract is explicit and versioned.
3. Core domain logic lives in services, not routes.
4. Persistence concerns stay out of UI code.
5. Validation happens at boundaries and in business logic where needed.
6. Round completion is a first-class invariant.
7. The web app is the first shipping surface; mobile comes later.

## Runtime architecture

### Web app

- React SPA served separately from the API
- consumes typed API client
- uses React Router for navigation
- uses TanStack Query for server state
- uses Zustand only for client UI state that should not live in the server cache

### API

- FastAPI app with `api`, `schemas`, `services`, `repositories` or `crud`, `models`, and `core` layers
- PostgreSQL as the source of truth
- Alembic for schema migrations
- pytest for unit and integration tests

### Shared contract

- OpenAPI generated client or manually maintained typed client
- request/response DTOs versioned alongside the API

## Recommended app layers

### API layer

Handles request parsing, dependency injection, auth placeholder, and response shaping.

### Service layer

Contains round rules, scoring rules, locking rules, and summary generation.

### Data layer

SQLAlchemy models and repository or CRUD helpers.

### Presentation layer

Web screens, components, hooks, and route modules.

## Implementation note

Do not over-microservice this. The product docs discuss multiple conceptual services, but the correct near-term implementation is a modular monolith.
