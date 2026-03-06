# Prompt 01 - Foundation

Use this repository to create a clean monorepo foundation for the Scrambling app.

## Context
- The uploaded product docs define a broader long-term product.
- For now, implement only the web + API MVP foundation.
- Keep the existing proof of concept only as a reference and do not build on its architecture.

## Goals
1. Create a repo structure with:
   - `apps/api`
   - `apps/web`
   - `packages/api-client`
   - `packages/shared-types`
   - `docs/product`
   - `docs/architecture`
   - `docs/development`
2. Add linting, formatting, and test setup for both apps.
3. Add a root `README.md` and per-app READMEs.
4. Add or preserve docs required by the source-of-truth files.
5. Do not implement product features yet.

## Requirements
- strict TypeScript on the web side
- FastAPI app scaffold on the API side
- commands documented
- CI skeleton added

## Output format
At the end, provide:
- files created or modified
- install and run commands
- test commands
- known risks or open items
