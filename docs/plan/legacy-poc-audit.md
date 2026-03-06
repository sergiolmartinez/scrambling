# Legacy POC Audit

## High-value behaviors worth preserving conceptually

- setup flow from home into game
- course search idea
- per-hole interaction model
- per-shot contribution selection
- leaderboard derived from contributions

## Problems in the current backend snapshot

### Routing issues

The backend composes routers with top-level prefixes and then repeats route segments inside route definitions. This leads to awkward paths and indicates the routing surface is not yet normalized.

### Broken references

There are clear signs of missing imports and unresolved names in the current snapshot. That makes it unsuitable as the direct base for the rebuild.

### Domain model gaps

The current backend model is too minimal for the documented product direction. It does not cleanly separate round players, hole scores, and contribution semantics in a future-friendly way.

### Missing operational basics

- no migrations
- no clear service layer
- no evidence of robust automated testing
- no release-quality error contract

## Problems in the current frontend snapshot

- large stateful components
- direct external API integration in UI
- no clear app shell or route architecture
- weak separation between domain logic and presentation
- styling does not match the stronger design intent in the docs

## Recommendation

Keep the current POC in the repo history for reference. Start the new implementation from a clean structure.
