# Astartes Forge v2.4.7 — Rules Render & Dedup Fix

Maintenance release focused on Rules & Stratagems readability.

## Fixed
- Stratagem cards now render one canonical WHEN row, one TARGET row, one EFFECT row, and one optional RESTRICTION row.
- Duplicate TARGET/WHEN/EFFECT characteristics from New Recruit are consolidated instead of rendered as repeated labels.
- DURATION data is preserved inside the EFFECT row rather than adding a fifth card section.
- Selected detachment rules are excluded from Army Rules by source ID, normalized rule name, and normalized rule text.
- Restores the safe post-import render isolation from v2.4.5 while retaining the v2.4.6 dashboard scope correction.
- Saga of the Bold no longer appears both as an Army Rule and a Detachment Rule.

## Unchanged
Datasheets, attachments, weapon parsing/merging, Chapter libraries, print layout, and themes are unchanged.
