# Verification Checklists

## Foundation

- repo installs from fresh clone
- api starts locally
- web starts locally
- lint and tests run from documented commands

## Round creation

- can create a round
- new round loads with empty players and no course
- refresh preserves round

## Player management

- can add player names
- cannot exceed 4 players
- can edit player names before completion
- can delete players before completion
- cannot mutate players after completion

## Course selection

- can search courses
- can select course
- hole metadata appears in scoring view
- empty and no-result states render cleanly

## Hole scoring

- can update score for hole 1
- can navigate across holes
- saved score persists after refresh
- invalid scores are rejected with clear feedback

## Contributions

- can add a contribution for one player on one shot
- can add multiple contributing players on same shot
- duplicate player on same hole/shot is prevented
- can remove one contribution
- removed contribution no longer appears on leaderboard

## Leaderboard

- totals reflect current contributions
- ordering is correct
- changes update after contribution changes

## Completion and summary

- complete round succeeds once
- round becomes locked
- mutating endpoints reject further changes
- summary shows players, course, hole scores, and contribution totals
