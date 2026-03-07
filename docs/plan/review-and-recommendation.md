# Scrambling Review and Recommendation

## Executive recommendation

Rebuild Scrambling from a clean monorepo foundation. Keep the existing proof of concept only as a behavioral reference for scoring semantics and screen order. Do not extend the existing codebase as the long-term foundation.

## Review summary

### Product documentation strengths

The uploaded Scramble docs are strong on vision, roadmap, architecture direction, QA intent, and coding standards. They describe a much broader product than the current proof of concept, including:

- account management and authentication
- course search and course details
- game creation and player setup
- live scoring
- stats and history
- achievements and progression
- social sharing and notifications
- mobile-first support
- CI/CD, QA, and observability expectations

### Current proof of concept strengths

The POC is still valuable because it shows the core interaction model you are really after:

- player setup
- course search
- round setup
- hole-by-hole interaction
- contribution tracking by shot
- leaderboard calculation
- export/share concepts

### Current proof of concept weaknesses

The backend is incomplete and not safe to scale as-is:

- inconsistent router composition
- missing imports and runtime breakages
- weak separation of concerns
- no migrations
- thin validation
- incomplete locking rules
- limited testability
- data model is too small for the documented roadmap

The frontend is also not a suitable long-term base:

- tightly coupled component state
- large screen components with mixed concerns
- direct third-party API calls from UI
- no typed API contract with backend
- weak reuse and limited testing surface
- styling and UX do not match the stronger product direction in the docs

## Recommended implementation strategy

### Treat the current code in three buckets

#### Keep as reference only

- scoring behavior
- contribution semantics
- screen progression
- rough shape of setup -> play -> leaderboard -> summary

#### Rebuild cleanly

- backend application structure
- database schema
- API contracts
- frontend routing and data layer
- state management
- validation
- tests
- styling system

#### Defer from MVP

- OAuth and account system
- social graph and friends
- achievements and leveling
- notifications
- full analytics
- real-time multiplayer sync
- offline sync engine
- native mobile implementation

## Why a clean rebuild is the right move

The docs define a product that wants a stable backend contract, a modern web frontend, eventual mobile expansion, and disciplined testing/documentation. The current POC does not offer a strong enough base for that. A clean rebuild is lower risk than progressively patching architectural debt into the POC.

## Recommended target for V1

Build a true web-first MVP with a clean API and a future-ready repo structure:

- create round
- search/select course
- add players
- score hole by hole
- capture per-shot contributions
- calculate leaderboard
- complete round
- show round summary
- responsive web UI
- good docs, tests, and migrations

## Recommended stack

### Web

- Vite
- React
- TypeScript
- React Router
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui

### API

- FastAPI
- SQLAlchemy 2.x
- Alembic
- PostgreSQL
- Pydantic v2
- pytest

### Shared

- generated or strongly typed API client
- shared type package where it materially reduces duplication

## Final recommendation

Use Codex as an implementation accelerator, not as an architect. Lock the architecture and MVP scope first, then drive Codex through milestones with strict acceptance criteria.
