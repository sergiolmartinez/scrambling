# Scrambling Frontend Redesign Spec

## Purpose

Redesign the Scrambling frontend from an MVP engineering-focused interface into a clean, intuitive, mobile-first sports scoring product.

This redesign must preserve the current backend contracts and core application architecture while significantly improving usability, clarity, visual hierarchy, and product feel.

## Product Goals

1. Make the app feel like a real sports companion app rather than an internal tool.
2. Reduce friction during setup and scoring.
3. Improve mobile ergonomics for use during an active round.
4. Clarify state, progress, and save/sync feedback.
5. Support light mode and dark mode cleanly.
6. Improve user-facing messaging, status indicators, and error handling.

## Non-Goals

- No backend API contract changes
- No auth implementation in this phase
- No invite system implementation in this phase
- No mobile app rewrite in this phase
- No major backend architecture changes

## Core UX Principles

### 1. One primary task per screen

Each screen should focus on one dominant user goal.

### 2. Minimize typing

Prefer taps, chips, dropdowns, segmented controls, and buttons over freeform text or numeric input whenever possible.

### 3. Persistent state awareness

Users should always understand:

- what round they are in
- what hole they are on
- whether data is saved/syncing/offline
- what their next action should be

### 4. Mobile-first ergonomics

Important actions should be reachable one-handed on a phone, with strong tap targets and sticky bottom actions where appropriate.

### 5. Friendly and actionable feedback

Errors and statuses must be clear, concise, and non-technical.

## Target Experience

The redesigned UI should feel:

- calm
- modern
- sporty
- fast
- obvious
- trustworthy

It should take visual inspiration from polished sports and fitness products rather than admin dashboards.

## Route-Level Scope

### `/setup`

Redesign as a guided round-start experience:

- orientation header
- progress framing
- course selection
- player setup
- clear readiness state

### `/scoring`

Redesign as the primary gameplay screen:

- single-hole focus
- prominent score context
- fast contribution entry
- sticky action area
- strong save/sync visibility

### `/leaderboard`

Redesign for glanceable ranking and context.

### `/summary`

Redesign for completion clarity and coherent recap.

## Information to Keep Visible

### Setup

- round status
- progress state
- selected course
- player count/readiness

### Scoring

- current hole
- par
- save/sync status
- selected shot details
- next action

### Leaderboard

- rank
- contributions
- round state

### Summary

- round completion state
- course
- roster
- final standings
- next action

## Information to Hide From Users

Do not expose technical/internal implementation details such as:

- database ids
- external provider ids
- round ids
- hole indexes as raw internal values
- backend/provider language
- low-level validation details

## UX Language Direction

Use product-friendly phrasing:

- “Start Round”
- “Who’s playing?”
- “Select Course”
- “Saved just now”
- “Couldn’t save shot. Try again.”

Avoid engineering terminology:

- “mutation”
- “resource”
- “payload”
- “assign internal course”
- “API error”

## Theme Support

The redesign must support:

- light mode
- dark mode
- system theme preference

## Accessibility Expectations

- visible focus states
- clear contrast
- icon + text where needed
- readable sizing on mobile
- no color-only meaning for critical status
