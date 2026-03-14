# Frontend Redesign Implementation Plan

## Purpose

Track the implementation of the Scrambling frontend redesign in a structured way.

## Scope

This plan covers a frontend-only redesign that preserves backend contracts and core architecture.

## Workstreams

### 1. Foundation

- theme support
- app shell cleanup
- design primitives
- status/error messaging patterns

### 2. Setup Redesign

- landing/setup framing
- progress checklist
- course search presentation
- player setup interaction cleanup

### 3. Scoring Redesign

- single-hole focus
- shot type selection improvements
- player selection improvements
- save/sync status visibility
- sticky action area

### 4. Leaderboard and Summary

- rank clarity
- recap hierarchy
- completion status clarity

## Documentation Expectations

For every implementation phase:

- relevant README files must remain accurate
- any route behavior assumptions must be reflected in docs
- prompts used for Codex should be preserved in `docs/development/codex-prompts/`

## Verification Expectations

Each implementation prompt must end with:

1. files changed
2. commands to run
3. commands to test
4. manual verification steps
5. follow-up notes

## Current Phase Status

- [x] foundation
- [x] setup redesign
- [x] scoring redesign
- [ ] leaderboard and summary redesign
- [ ] dark/light mode verification
- [ ] docs refresh complete
