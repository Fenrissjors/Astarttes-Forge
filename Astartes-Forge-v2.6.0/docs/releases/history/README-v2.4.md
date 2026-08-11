# Astartes Forge v2.4 — Unified Chapter Engine

This release consolidates the existing Generic Adeptus Astartes and Space Wolves support with the new Blood Angels module on the same lossless, data-driven engine.

## Engine rules

1. **New Recruit is authoritative for roster facts** — models, counts, weapons, local weapon keywords, unit/faction keywords, points, attachment eligibility, selected Enhancements and selected Detachments are read from the ROSZ source graph first.
2. **Rules Library is supplementary** — it supplies complete Detachment reference data when ROSZ omits it, especially Stratagems and the full Enhancement catalogue.
3. **Chapter Library is metadata only** — it groups verification suites and Chapter modules. It never injects Chapter keywords into units.
4. **Renderer never invents loadouts** — weapon/profile merging only occurs after unique ROSZ source profiles are registered and identical profiles are proven equivalent.

## Included verified modules

- Generic Adeptus Astartes: 10 verification detachments, plus Vengeful Hosts as a ready extra.
- Space Wolves: 7 verification detachments.
- Blood Angels: 8 verification detachments.

## Blood Angels

Added concise Rules Library references and manifests for:

- Legacy of Grace — 1DP / Priority Assets / 2 Enhancements / 3 Stratagems
- Encarmine Speartip — 1DP / Disruption / 2 Enhancements / 3 Stratagems
- Wrath of the Doomed — 1DP / Purge the Foe / 2 Enhancements / 3 Stratagems
- The Angelic Host — 2DP / Disruption / 4 Enhancements / 6 Stratagems
- The Lost Brethren — 2DP / Purge the Foe / 4 Enhancements / 6 Stratagems
- Angelic Inheritors — 3DP / Priority Assets / 4 Enhancements / 6 Stratagems
- Liberator Assault Group — 3DP / Take and Hold / 4 Enhancements / 6 Stratagems
- Rage-cursed Onslaught — 3DP / Purge the Foe / 4 Enhancements / 6 Stratagems

The Blood Angels ROSZ verification files and stress roster are included in this package.

## Verification changes

The Live Batch Test Lab now checks every Detachment in a multi-detachment roster instead of only the first one. Verification dashboards are grouped by Chapter module and use dynamic totals.

## Data separation

Imported/selected Enhancement records are preserved separately as `selectedEnhancements`; they no longer replace the complete Enhancement catalogue used by rules verification.
