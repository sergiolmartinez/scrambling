# Codex Prompt - Auth 03 - Ownership, Profile, and Settings

You are working in the Scrambling repository on branch: feature/auth-foundation.

CRITICAL CONSTRAINTS:

- Do NOT use shell-based file writing
- Use patch-style edits only
- Do NOT implement invite collaboration yet
- Keep account management lightweight

Source of truth:

- docs/product/auth-foundation-spec.md
- docs/architecture/auth-architecture.md
- docs/development/auth-implementation-plan.md

Goal:
Add ownership wiring plus lightweight profile and settings pages.

Scope:

1. Associate rounds with owner user
2. Ensure new rounds are owned by the authenticated user
3. Add profile page
4. Add settings page
5. Add display name editing if appropriate
6. Add theme preference integration if appropriate
7. Keep product UX clean and simple

Profile page should include:

- display name
- email
- created date
- initials/avatar placeholder

Settings page should include:

- theme preference
- display name or account details if appropriate
- sign out
- app/account information section

Acceptance criteria:

- new rounds are owned by signed-in users
- profile page works
- settings page works
- no invite features yet
- docs updated

At the end provide:

1. files changed
2. migrations added
3. commands to run
4. commands to test
5. manual verification steps
6. follow-up notes for auth prompt 04
