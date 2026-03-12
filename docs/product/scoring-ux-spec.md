# Scrambling Scoring UX Spec

## Purpose

Define the ideal scoring experience for Scrambling. This is the most important screen in the product and should be optimized for fast, low-friction use during active play.

## Core Design Requirements

1. The user must always know:
   - current hole
   - par
   - current score state
   - save/sync state
   - next available action

2. The user should be able to record a shot with minimal typing.

3. Primary actions should be thumb-accessible on mobile.

4. Feedback must be immediate and understandable.

## Screen Priorities

### Highest priority

- current hole context
- shot entry
- player selection
- save/sync confidence
- next hole navigation

### Secondary priority

- detailed metadata
- historical shot list
- secondary labels

## Scoring Interaction Model

### Hole header

Must clearly show:

- Hole number
- Par
- optional completion state badge
- current round context

### Score controls

Should feel lightweight and obvious.
Prefer concise controls rather than dense forms.

### Shot entry

Shot type should be selected via dropdown or tap control, not freeform text.

Recommended shot type options:

- Drive
- Par 3 Tee Shot
- Fairway Wood
- Hybrid
- Long Iron
- Mid Iron
- Short Iron
- Approach
- Pitch
- Chip
- Bunker
- Putt
- Gimme
- Water Hazard
- Out of Bounds
- Penalty

For simplified UI, the default primary set may be:

- Drive
- Iron
- Approach
- Chip
- Putt
- Gimme
- Penalty

Advanced options can be exposed in a dropdown or secondary picker.

### Player selection

Should use chips, segmented controls, or similarly fast selection patterns.

### Save status

Always show one of:

- Saved
- Saving…
- Syncing…
- Offline
- Couldn’t save

### Navigation

Previous/next hole controls should be easy to reach and clearly labeled.

## Error Handling

### User-facing error examples

Good:

- “Couldn’t save this shot.”
- “No player selected yet.”
- “Try again.”

Bad:

- “Mutation failed”
- “422 validation error”
- “Unhandled promise rejection”

## Mobile UX Requirements

- sticky bottom action area where helpful
- no tiny controls
- avoid multi-column dense layouts
- use spacing generously
- prioritize single-hole focus over data density

## Acceptance Criteria

- User can understand the scoring screen immediately
- User can record a shot quickly on mobile
- User sees clear feedback after every scoring action
- Hole navigation is obvious
- Error messages appear close to the relevant interaction
