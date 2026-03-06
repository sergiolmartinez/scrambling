# Scrambling MVP Scope

## Product goal

Deliver a polished, mobile-friendly web app for tracking a scramble golf round from setup through completion.

## In scope

### Round creation

- create a new round
- persist round state on the server
- support draft or active round state

### Course selection

- search for courses
- select a course for the round
- show hole-by-hole course metadata required for scoring
- support fallback manual course assignment later, but not required in first milestone unless external API access becomes a blocker

### Players

- add 1 to 4 players to a round
- edit or remove players before the round is completed
- show players consistently across scoring and leaderboard views

### Live scoring

- navigate hole by hole
- record hole score
- record per-shot contribution selections
- support multiple players contributing on the same shot
- update running totals and leaderboard as data changes

### Leaderboard

- show total contributions per player
- support breakdown by shot category only if already naturally supported by the chosen model; otherwise defer detailed category analytics

### Completion

- complete a round
- lock further edits after completion
- expose a round summary endpoint and summary screen

### UX and quality

- responsive web experience
- loading, empty, and error states
- form validation
- basic accessibility
- tests for core business rules
- docs updated along the way

## Out of scope for MVP

- user auth
- persistent user accounts
- friends and social graph
- Discord sharing
- achievements, XP, levels, badges
- push notifications
- full player history dashboard
- native mobile app
- websocket multiplayer sync
- offline sync engine
- payment or monetization
- admin portal

## Definition of done for MVP

The MVP is done when:

1. a user can create a round
2. select a course
3. add players
4. score all holes
5. record and remove contributions
6. see a leaderboard
7. complete the round
8. view a summary
9. refresh and retain saved server state
10. all critical flows have automated tests and manual verification checklists

## Non-functional targets for MVP

- common UI actions feel immediate
- API responds fast enough for normal personal use
- validation failures are explicit and user-friendly
- round completion reliably prevents editing
- app can be run locally by another developer from the docs alone
