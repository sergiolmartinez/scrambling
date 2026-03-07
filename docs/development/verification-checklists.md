# Verification Checklists

## Foundation

- repo installs from fresh clone
- api starts locally
- web starts locally
- lint and tests run from documented commands

## Round creation

- can create a round
- round aggregate endpoint includes round, players, hole scores, and contributions
- new round loads with empty players and no course
- refresh preserves round
- setup route preserves selected round id across browser refresh

## Player management

- can add player names
- cannot exceed 4 players
- can edit player names before completion
- can delete players before completion
- cannot mutate players after completion
- setup route blocks add-player action when 4 players already exist

## Course selection

- can search courses
- can fetch course detail by id
- can select course
- hole metadata appears in scoring view
- empty and no-result states render cleanly
- assigned course appears in setup state before routing to scoring

## Setup to scoring handoff

- continue-to-scoring action stays disabled until at least one player and assigned course exist
- continue-to-scoring action routes to scoring shell with current round context
- completed rounds show locked messaging and disable setup mutations

## Hole scoring

- can update score for hole 1
- can navigate across holes
- scoring view shows current hole and total holes
- saved score persists after refresh
- invalid scores are rejected with clear feedback

## Contributions

- can add a contribution for one player on one shot
- can add multiple contributing players on same shot
- can fetch contributions for one hole
- duplicate player on same hole/shot is prevented
- can remove one contribution
- removed contribution no longer appears on leaderboard

## Leaderboard

- totals reflect current contributions
- ordering is correct
- changes update after contribution changes
- scoring route shows a leaderboard snapshot that updates after contribution mutations

## Completion and summary

- complete round succeeds once
- round becomes locked
- mutating endpoints reject further changes
- summary shows players, course, hole scores, and contribution totals
- summary route shows leaderboard and hole-by-hole results in a completion-focused layout
- leaderboard route shows ordered totals and clear final-state messaging for completed rounds
