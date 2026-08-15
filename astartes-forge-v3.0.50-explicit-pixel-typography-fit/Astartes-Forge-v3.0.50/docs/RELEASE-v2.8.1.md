# Astartes Forge v2.8.1 — Source Integrity & Completeness

This release replaces semantic/wording guesses in Batch Test Lab with a lossless-data check.

## Integrity contract

Astartes Forge validates that source selection ownership, source profile/rule IDs, weapon characteristics and counts remain traceable to the imported ROSZ source graph. It does not decide whether Games Workshop wording should contain a numeric distance or modifier.

### States
- **Source intact** — all tested source relationships and values survive normalisation.
- **Source ambiguity** — source provenance cannot be fully proven; this remains a passing informational state.
- **Data loss detected** — a source record/value is missing, reassigned or changed after import.
