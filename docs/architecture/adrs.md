# Architecture Decisions

## ADR-001: Modular monolith first

### Decision
Implement Scrambling as a modular monolith rather than independent deployable services.

### Why
The product docs discuss multiple conceptual services, but current scope and team size do not justify multi-service operational overhead.

### Consequence
Keep logical service boundaries in code, but deploy one API application for now.

---

## ADR-002: Web-first MVP

### Decision
Ship a responsive web app before building React Native.

### Why
This gives the fastest path to validate the core scoring experience while preserving the option to add Expo or React Native later.

### Consequence
All architecture should allow a later `apps/mobile` addition without rewriting the backend.

---

## ADR-003: PostgreSQL for server persistence

### Decision
Use PostgreSQL in the API environment even if local development optionally supports SQLite for quick setup.

### Why
The docs point toward PostgreSQL, and it better matches future scale, migrations, and relational integrity needs.

### Consequence
Primary migrations and tests should target PostgreSQL compatibility.

---

## ADR-004: Contribution-first leaderboard

### Decision
Model the leaderboard from per-shot contribution records rather than storing leaderboard totals.

### Why
The core product differentiator is contribution tracking. Derived leaderboards are safer and less error-prone than maintaining redundant counts.

### Consequence
Optimize with query design only if performance later requires it.

---

## ADR-005: Generated or strongly typed API client

### Decision
Use an explicit API client between web and API.

### Why
The current POC drifts too easily because UI behavior and backend shape are loosely coupled.

### Consequence
Contract changes must update client types and tests.
