# Astartes Forge v2.4.4 — Datasheet Structure

## Added
- Datasheets now preserve New Recruit's three-layer distinction: explained **Abilities**, title-only **Rules**, and **Keywords / Faction Keywords**.
- Core rules such as `Deadly Demise D6+2` remain visible as rule titles without reproducing their full core-rule text.
- Imported Character Enhancements are shown directly in Army Forge so attachment choices are easier to review.
- Invulnerable Saves are displayed above the normal Save characteristic in a shield badge.

## Data authority
- Invulnerable Save is read from the selected ROSZ data only: first from `InSv` on the model Unit profile, then from an imported `Invulnerable Save` profile created by selected wargear when applicable.
- Enhancement names are read from exact imported selections carrying the New Recruit `Enhancements` cost marker.
- Rules are taken from exact `<rule>` elements owned by the unit; explained abilities remain sourced from New Recruit Ability profiles.

## Regression
- 25/25 verification detachments internally consistent.
- 26 ready/reference detachments synchronized with the existing official-reference metadata layer.
- 33 ROSZ regression files audited.
- Deadly Demise variants observed in the corpus: 1, D3, D6 and D6+2.
