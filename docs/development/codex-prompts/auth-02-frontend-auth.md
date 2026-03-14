# Codex Prompt - Auth 02 - Frontend Auth

You are working in the Scrambling repository on branch: feature/auth-foundation.

CRITICAL CONSTRAINTS:

- Do NOT use shell-based file writing
- Use patch-style edits only
- Do NOT implement invites yet
- Keep backend contracts stable after auth routes are added

Source of truth:

- docs/product/auth-foundation-spec.md
- docs/architecture/auth-architecture.md
- docs/development/auth-implementation-plan.md

Goal:
Implement frontend auth foundation.

Scope:

1. Add sign in screen
2. Add sign up screen
3. Add current user session handling
4. Add protected route handling
5. Add sign out flow
6. Keep UI product-friendly and aligned with redesigned frontend

Acceptance criteria:

- unauthenticated user is redirected appropriately
- authenticated user can navigate product normally
- sign in and sign up feel clean and simple
- sign out works
- docs updated if needed

Important:

- Frontend session state should be restored via `GET /api/v1/auth/me`
- Do not store primary auth tokens in localStorage
- Protected routes should rely on authenticated user context derived from backend session state

At the end provide:

1. files changed
2. commands to run
3. commands to test
4. manual verification steps
5. follow-up notes for auth prompt 03
