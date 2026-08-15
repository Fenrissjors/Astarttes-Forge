
# Astartes Forge v3.0.6 — Clean Print Renderer Rebuild

## Strict renderer separation
- Datasheets tab uses the responsive functional datasheet renderer only.
- No artwork, fixed A4 sizing, print shells or print frames appear in Datasheets.
- Theme Preview and Forge Army Pack use the same print-card renderer.

## One universal datasheet structure
Every unit follows:
Header → Stats → Ranged Weapons → Melee Weapons → Abilities → Enhancement → Rules → Keywords → Faction Keywords.
Attached Leader / Support models add content inside those same sections instead of selecting a different card design.

## Theme controls
Only:
- Chapter emblem on/off
- Sier rand on/off
- Background: parchment / white
- Output: 1× A4 portrait or 2× A5 landscape per A4

Chapter identity is resolved automatically from the imported roster.

## Print preview
Theme Preview is a scaled copy of the physical print card. Forge Army Pack creates fresh print cards through the same renderer instead of cloning the normal Datasheets tab.

No ROSZ parsing, detachment/rule, weapon, provenance or Source Integrity semantics were intentionally changed.
