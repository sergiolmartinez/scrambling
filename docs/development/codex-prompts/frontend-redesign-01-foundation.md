# Codex Prompt - Frontend Redesign 01 - Foundation

You are working in the Scrambling repository on branch: feature/frontend-redesign.

This task is the beginning of a design-first frontend redesign.

CRITICAL CONSTRAINTS:

- Do NOT change backend contracts
- Do NOT add auth, invites, or new backend features
- Do NOT modify API request/response shapes
- Do NOT use shell-based file writing
- Use patch-style edits only
- Keep architecture intact
- Keep docs and README files updated if needed

Source of truth:

- docs/product/frontend-redesign-spec.md
- docs/product/scoring-ux-spec.md
- docs/architecture/frontend-design-system.md
- docs/development/frontend-redesign-plan.md

Goal:
Implement the frontend design foundation.

Scope:

1. Add theme foundation for:
   - light mode
   - dark mode
   - system preference
2. Establish or refine frontend design primitives and shared visual patterns
3. Improve app shell consistency
4. Introduce reusable status and state patterns for:
   - loading
   - empty
   - error
   - saved/syncing/offline
5. Add icon usage where appropriate
6. Preserve all current flows

Preferred implementation direction:

- use current stack
- add reusable components rather than route-only styling
- mobile-first
- clean, modern sports app direction
- avoid unnecessary dependency churn

Potential components:

- PageHeader
- PageSection
- StatusBadge
- SaveStatusBadge
- EmptyState
- ErrorState
- LoadingState
- StickyActionBar
- theme toggle if appropriate

Acceptance criteria:

- app has a coherent visual foundation
- theme support works cleanly
- status and error presentation is more user-friendly
- no backend/API changes
- existing routes still function

At the end provide:

1. files changed
2. commands to run the app
3. commands to run tests/lint
4. manual verification steps
5. follow-up notes for redesign prompt 02
