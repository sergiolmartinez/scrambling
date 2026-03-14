# Codex Prompt - Auth 01 - Backend Foundation

You are working in the Scrambling repository on branch: feature/auth-foundation.

CRITICAL CONSTRAINTS:

- Do NOT use shell-based file writing
- Use patch-style edits only
- Keep docs and README files accurate
- Do NOT implement invites yet
- Do NOT add Google sign-in yet unless explicitly required
- Keep the solution simple and maintainable

Source of truth:

- docs/product/auth-foundation-spec.md
- docs/architecture/auth-architecture.md
- docs/development/auth-implementation-plan.md

Goal:
Implement backend auth foundation.

Scope:

1. Add a user model
2. Add password hashing
3. Add sign-up, sign-in, sign-out endpoints
4. Add current user endpoint
5. Add backend auth/session validation
6. Add necessary migrations
7. Add backend tests

Important:

- Use secure HTTP-only cookie-based authentication for browser sessions
- Do not use localStorage token auth as the primary session model
- Implement email/password auth first
- Document the session/auth approach clearly in the auth architecture docs
- keep this foundation compatible with future invites/collaboration

Acceptance criteria:

- user can sign up
- user can sign in
- user can sign out
- current user endpoint works
- tests pass
- docs updated

At the end provide:

1. files changed
2. migrations added
3. commands to run
4. commands to test
5. manual verification steps
6. follow-up notes for auth prompt 02
