# Auth Architecture

## Purpose

Define the backend and frontend architecture for Scrambling authentication and ownership.

## Backend Responsibilities

- create user accounts
- authenticate credentials
- issue and validate auth session/token
- expose current user endpoint
- protect authenticated routes as needed
- associate rounds with owner user

## Frontend Responsibilities

- present sign in/sign up flows
- store and restore session state appropriately
- guard protected routes
- fetch current user
- expose profile/settings UI

## Recommended Initial Model

### User

- id
- email (unique)
- display_name
- password_hash
- created_at
- updated_at

### Round

- existing fields
- owner_user_id (nullable during migration if needed, then ideally required for new rounds)

## API Surface (expected)

- POST /api/v1/auth/sign-up
- POST /api/v1/auth/sign-in
- POST /api/v1/auth/sign-out
- GET /api/v1/auth/me

Optional:

- PATCH /api/v1/users/me
- GET /api/v1/users/me

Implemented in Auth 03:

- PATCH /api/v1/users/me
- GET /api/v1/users/me

## Session Strategy

Choose one and document it in implementation:

- secure cookie session
- token/JWT-based auth

For MVP, prefer the simplest secure implementation that fits the current stack cleanly.

## Route Protection

Protected frontend routes should require authenticated user context.

## Future Compatibility

This architecture should support later:

- invite flows
- shared rounds
- Google sign-in
- password reset

## Chosen Auth Strategy

Scrambling uses secure HTTP-only cookie-based authentication for the browser client.

### Rationale

- avoids storing auth tokens in localStorage
- supports a cleaner browser UX
- fits the current FastAPI + React architecture well
- provides a strong foundation for future collaboration features

### Initial Behavior

- user signs up or signs in with email and password
- backend validates credentials
- backend sets a secure HTTP-only auth cookie (`scrambling_session` by default)
- frontend restores session state by calling `GET /api/v1/auth/me`
- protected routes require authenticated user context

### Frontend Foundation (Auth 02)

- Sign-in route: `/sign-in`
- Sign-up route: `/sign-up`
- Session restore: centralized auth provider calls `GET /api/v1/auth/me`
- Route protection:
  - unauthenticated users are redirected to sign-in
  - authenticated users are redirected away from auth screens into app routes
- Sign-out clears server session via `POST /api/v1/auth/sign-out` and returns user to sign-in

## Ownership and Account Pages (Auth 03)

- New rounds are created with `owner_user_id` assigned to the authenticated user.
- Round access and mutation routes enforce owner scoping.
- Legacy ownerless rounds are claimed by the first authenticated user who accesses them.
- Profile route: `/profile` with display name, email, account created date, and initials placeholder.
- Settings route: `/settings` with theme preference, display name update, and sign-out action.

### Security Expectations

- cookies should be HTTP-only
- cookies should be Secure in production
- SameSite should be configured appropriately
- password hashes must use a modern algorithm

## Backend Implementation Notes (Auth 01)

- Session model: server-side session rows in `auth_sessions` keyed by hashed opaque tokens.
- Cookie model: opaque session token in an HTTP-only cookie; session token hash is stored in DB.
- Password model: PBKDF2-HMAC-SHA256 with per-user salt and configurable iteration count.
- Initial auth API:
  - `POST /api/v1/auth/sign-up`
  - `POST /api/v1/auth/sign-in`
  - `POST /api/v1/auth/sign-out`
  - `GET /api/v1/auth/me`
- `GET /api/v1/auth/me` returns `401 unauthorized` when no valid active session exists.
