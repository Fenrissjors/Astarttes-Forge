# Astartes Forge v2.6.1 — Structure-Aware Data Model

This release extends the lossless New Recruit philosophy beyond import. Parent/child ownership is preserved in the normalized Army Model so presentation and validation can use the relationships New Recruit already exports.

## Structure-aware ownership

The normalized model now retains:

- unit → model selections;
- model/selection → weapon profiles;
- model/selection → abilities and Rules;
- Character/model → selected Enhancements;
- detachment selection → rule source tree;
- source selection/profile/rule IDs for diagnostics.

The visual renderer can still merge identical weapon/stat profiles for readability, but the source relationships remain available underneath.

## Detachment rules

Detachment Rule prose, named/bulleted sub-rules and Restrictions are kept in source order. A rule made entirely from valid sub-rules is accepted by verification; a Restrictions-only record is not treated as a complete Detachment Rule.

## Precision validation

`within range of an objective marker` is valid game terminology and no longer produces a false missing-distance error. Other vague `within range` phrases remain flagged.

## Source & Edition Inspector

The inspector reports whether the Structured Army Model is active and how many model/weapon/ability/rule/enhancement ownership links were preserved.

## Regression audit

- 33/33 verification detachments internally consistent.
- 42 ROSZ regression files audited (41 unique).
- Structure-aware ownership confirmed across all 42 roster files.
- 2,356 parent/child selection links, 3,063 direct profile ownerships and 2,006 direct rule ownerships observed in the current corpus.
