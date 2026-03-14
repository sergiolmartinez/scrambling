# Scrambling Auth Foundation Spec

## Purpose

Introduce authentication and user ownership to Scrambling so rounds can belong to users and the application can support future collaboration and invite features.

This phase establishes identity, protected access, and basic account management without expanding into full social or enterprise account features.

## Goals

1. Add authentication to the product.
2. Add a basic user model.
3. Associate rounds with a user owner.
4. Add protected routing and current-user awareness in the frontend.
5. Add a lightweight profile page.
6. Add a lightweight settings page.
7. Preserve current core gameplay flows.

## Non-Goals

- No invite collaboration flow yet
- No public profile system
- No image upload/avatar pipeline
- No advanced permission model
- No notifications center
- No social graph or friend system
- No organization/team model

## Recommended Auth Mode

Initial implementation should support:

- email
- password
- sign in
- sign up
- sign out
- session persistence

Optional later:

- Google sign-in
- password reset
- email verification

## Core User Model

Required fields:

- id
- email
- display_name
- password hash
- created_at
- updated_at

## Ownership Model

Rounds should belong to a user:

- rounds.owner_user_id

Existing rounds without owners may need migration handling depending on environment strategy.

## Frontend Scope

### Auth pages

- Sign In
- Sign Up

### Protected app

Authenticated users can access:

- Home / My Rounds
- Setup
- Scoring
- Leaderboard
- Summary
- Profile
- Settings

### Settings page

Should initially support:

- theme preference
- display name update
- sign out
- app/account info

### Profile page

Should initially show:

- display name
- email
- account created date
- optional initials/avatar placeholder

## UX Principles

- Keep auth simple and low-friction
- Avoid enterprise-feeling account management
- Keep profile/settings clean and lightweight
- Preserve the product-first frontend direction

## Route Protection Expectations

Unauthenticated users should be redirected to sign in for protected routes.

Authenticated users should not need to re-login repeatedly in normal use.

## Acceptance Criteria

- user can sign up
- user can sign in
- user can sign out
- user session persists appropriately
- protected routes are enforced
- rounds can be associated with a user owner
- profile page exists and is usable
- settings page exists and is usable
