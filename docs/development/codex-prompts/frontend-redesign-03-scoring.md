# Codex Prompt - Frontend Redesign 03 - Scoring

You are working in the Scrambling repository on branch: feature/frontend-redesign.

This task is the scoring redesign pass.

CRITICAL CONSTRAINTS:

- Do NOT change backend contracts
- Do NOT add auth/invites
- Do NOT modify API request/response shapes
- Do NOT use shell-based file writing
- Use patch-style edits only

Source of truth:

- docs/product/frontend-redesign-spec.md
- docs/product/scoring-ux-spec.md
- docs/architecture/frontend-design-system.md

Goal:
Redesign the scoring screen to be simple, intuitive, modern, and mobile-first.

Scope:

1. Strengthen single-hole focus
2. Make save/sync/offline status clear and user-friendly
3. Improve hierarchy and ergonomics of score and contribution entry
4. Replace engineering-feeling shot type handling with a proper UI control
5. Use a dropdown or selection control for shot type
6. Keep actions thumb-friendly and obvious
7. Use icons where appropriate but do not over-decorate

Shot type expectations:
Use a user-friendly selection model for common golf shot types.

Recommended shot types:

- Drive
- Par 3 Tee Shot
- Fairway Wood
- Hybrid
- Long Iron
- Mid Iron
- Short Iron
- Approach
- Pitch
- Chip
- Bunker
- Putt
- Gimme
- Water Hazard
- Out of Bounds
- Penalty

If needed, present a simplified default list and support the fuller list in a dropdown/select.

Important UX expectations:

- avoid freeform typing when not necessary
- do not expose technical/internal scoring structures
- make error messages concise and actionable
- show save confidence clearly
- scoring should feel like a sports app, not a form tool

Acceptance criteria:

- scoring flow is faster and clearer on mobile
- shot type selection is user-friendly
- save/sync states are visible
- error handling is cleaner
- no backend/API changes

At the end provide:

1. files changed
2. commands to run app/tests
3. manual verification steps
4. follow-up notes for redesign prompt 04
