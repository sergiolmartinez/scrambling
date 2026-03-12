# Frontend Design System Direction

## Purpose

Define the visual and interaction system for the Scrambling frontend redesign.

## Design Principles

1. Product-first, not dashboard-first
2. Mobile-first layouts
3. Clear hierarchy and spacing
4. Friendly, modern sports app feel
5. Consistent status language
6. Reusable primitives over route-specific styling hacks

## Theme Model

Support:

- light
- dark
- system

## Color Direction

### Light Mode

- background: soft off-white or very light neutral
- surface: white
- primary: golf-inspired green
- text: strong neutral dark
- error: clear red
- warning: warm amber
- info/sync: subtle blue or neutral accent

### Dark Mode

- background: near-black neutral
- surface: elevated charcoal
- primary: brighter green
- text: soft white
- error: vivid but readable red
- warning: warm gold
- info/sync: subtle cool accent

## Typography

Use one clean modern UI font.
Recommended:

- Inter
- SF Pro equivalent where available

Hierarchy:

- Display / page heading
- Section heading
- Body
- Caption / metadata

## Core Components

### Layout

- AppLayout
- PageHeader
- PageSection
- StickyActionBar

### State

- StatusBadge
- SaveStatusBadge
- LoadingState
- EmptyState
- ErrorState
- CompletionBanner

### Data display

- SummaryCard
- StatRow
- RankRow
- ProgressChecklist
- SelectedCourseBanner

### Input / interaction

- PlayerChip
- ShotTypeSelect
- CourseResultCard
- ActionButton
- SecondaryButton

## Icons

Recommended icon library:

- Lucide

Suggested icons:

- flag
- map-pinned
- users
- user-plus
- trophy
- check
- alert-circle
- wifi-off
- refresh-cw
- moon
- sun

## Interaction States

Every interactive element should support:

- default
- hover
- active
- focus-visible
- disabled
- loading

## Error and Status Language

Use concise, user-friendly language.

Examples:

- Saved
- Saving…
- Syncing…
- Offline
- Couldn’t load courses
- No results yet
- Add at least one player

## Spacing Direction

Prefer generous spacing and distinct sections over compressed data density.

## Route Guidance

### Setup

Guided, welcoming, and obvious.

### Scoring

Fast, focused, and durable under active use.

### Leaderboard

Glanceable.

### Summary

Recap-focused and conclusive.
