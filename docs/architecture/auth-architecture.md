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
- backend sets a secure HTTP-only auth cookie
- frontend restores session state by calling `GET /api/v1/auth/me`
- protected routes require authenticated user context

### Security Expectations

- cookies should be HTTP-only
- cookies should be Secure in production
- SameSite should be configured appropriately
- password hashes must use a modern algorithm
