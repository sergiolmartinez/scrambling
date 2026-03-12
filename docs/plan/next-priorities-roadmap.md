# Next Priorities Roadmap

This roadmap captures the next implementation sequence after MVP hardening.

## Priority 1: UX uplift (current sprint)

- improve route-to-route clarity with progress-aware navigation
- tighten visual hierarchy on setup and scoring pages
- standardize component styles to support future auth/invite screens
- keep all existing round/course behavior unchanged

## Priority 2: Auth and login

### Scope

- add account model (`users`) and ownership on rounds
- add session/token model for authenticated API access
- support email/password login for MVP

### Backend sequence

1. create `users` + auth/session tables and migrations
2. add auth schemas and `/auth/register`, `/auth/login`, `/auth/me` routes
3. enforce authenticated access on round routes
4. tie `rounds` to an owner user id
5. extend API tests for unauthorized vs authorized behavior

### Frontend sequence

1. add `/login` route and auth store
2. persist token/session and hydrate on app load
3. route-guard existing round flow behind auth
4. show explicit unauthorized/session-expired states

## Priority 3: Player invitations

### Scope

- invite links for a round
- invite acceptance flow for authenticated users
- role-based permissions (`owner`, `editor`, optional `viewer`)

### Backend sequence

1. create `round_members` + `round_invites` tables
2. add invite issue/list/revoke/accept endpoints
3. enforce round access by membership instead of global visibility
4. add tests for invite lifecycle and permission boundaries

### Frontend sequence

1. add invite management panel on setup route
2. add invite accept screen and route
3. show round members in setup and summary
4. enforce role-specific UI actions

## Priority 4: Product evolution hygiene

- preserve service-layer boundaries (`routes` -> `services` -> `models`)
- keep provider integrations isolated from frontend concerns
- require migration + tests + docs in each feature PR
- maintain API contract docs for any new auth/invite endpoints
