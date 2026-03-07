# Monorepo Foundation

This document captures the initial technical baseline for the MVP implementation phase.

## Decisions

- monorepo structure with `apps/*` and `packages/*`
- strict TypeScript for the web app
- FastAPI scaffold for the API app
- shared contracts in `packages/shared-types`
- typed fetch client in `packages/api-client`

## Non-goals for this phase

- no product feature implementation
- no migration of legacy proof-of-concept architecture

## Legacy reference-only artifacts

- `backend/`
- `golf-scorecard-app/`
