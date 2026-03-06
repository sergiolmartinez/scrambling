# Codex Usage Notes

## How to get the best results

### Good pattern

1. paste one prompt
2. let Codex modify code
3. run the app and tests locally
4. fix any drift with a follow-up prompt tied to the failed behavior
5. commit milestone by milestone

### Bad pattern

- asking Codex to implement the entire product in one run
- letting it invent scope from broad docs
- skipping verification between milestones
- accepting docs that were not updated with code changes

## Suggested commit rhythm

- one milestone per PR where practical
- keep prompts saved in repo
- summarize any manual deviations in commit or PR notes

## What to require from every Codex result

- code changes
- docs changes
- tests
- commands
- verification steps
- list of unresolved issues
