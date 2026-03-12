# Codex Prompt - Frontend Redesign 02 - Setup

You are working in the Scrambling repository on branch: feature/frontend-redesign.

This task is part of the design-first frontend redesign.

CRITICAL CONSTRAINTS:

- Do NOT change backend contracts
- Do NOT add auth/invites
- Do NOT modify API request/response shapes
- Do NOT use shell-based file writing
- Use patch-style edits only

Source of truth:

- docs/product/frontend-redesign-spec.md
- docs/architecture/frontend-design-system.md
- docs/development/frontend-redesign-plan.md

Goal:
Redesign the setup flow to feel like a real product onboarding flow for starting a round.

Scope:

1. Redesign the top setup area with stronger orientation and product-friendly copy
2. Improve progress framing
3. Redesign course search and course selection presentation
4. Improve selected course visibility after assignment
5. Redesign player setup for lower friction and better readability
6. Reduce engineering-feeling UI language

Important UX expectations:

- “Start a round” should feel welcoming and obvious
- users should not need to think about backend concepts
- selected course should remain visually clear
- player setup should feel quick and light
- use icons where helpful, but avoid clutter
- keep mobile layouts thumb-friendly

Do not:

- change route structure significantly unless needed for presentation
- change backend behavior
- expose raw technical state to users

Acceptance criteria:

- setup feels guided and modern
- selected course is obvious
- player entry and management feels faster and clearer
- user-facing copy is product-friendly
- no backend/API changes

At the end provide:

1. files changed
2. commands to run app/tests
3. manual verification steps
4. follow-up notes for redesign prompt 03
