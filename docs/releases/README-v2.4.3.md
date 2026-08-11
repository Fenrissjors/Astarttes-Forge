# Astartes Forge v2.4.3 — Gold Master

Gold Master is a consolidation and audit release. It does not change the normal print-first workflow; it removes duplicate rule sources, tightens the keyword engine and pins the supported libraries to the current 11th-edition reference metadata.

## Key fixes

- `Deadly Demise X` is always keyword-only, including expressions such as `Deadly Demise D6+2`.
- Expanded 11th-edition keyword coverage includes Blast X, One-Shot, Cleave X, Conversion, Hunter, Heal X, Lone Operative X", Plunging Fire and Surge Moves.
- Removed obsolete duplicate inline Space Wolves / V3 detachment registries from `app.js`. The versioned Rules Library is now the only static detachment fallback.
- New Recruit remains authoritative for roster composition, selected rules, model/weapon counts, faction keywords, attachment eligibility and enhancement selections.
- Current official DP, Force Disposition and Enhancement metadata is synchronized into the supported Rules Library at load time.
- Corrected current Champions of Fenris to its 11th-edition 1DP Faction Pack version: 2 Enhancements and 3 Stratagems.
- Corrected Anvil Siege Force Enhancement metadata.
- Corrected Legends of Saga and Song and Veterans of the Fang Enhancement summaries to current Faction Pack values.
- Core Stratagem concise references were refreshed against the June 2026 Core Rules.

## Audit status

- 25/25 verification detachments internally consistent.
- 26 supported ready/reference detachment metadata entries synchronized against the Gold Master official reference set.
- 33 regression ROSZ files audited (32 unique by SHA-256).
- Keyword regression suite includes the Astraeus `Deadly Demise D6+2` case.

## Source-of-truth policy

1. Exact New Recruit ROSZ selection/profile/rule/category/cost data.
2. Normalized Army Object preserving source IDs.
3. Versioned Astartes Forge libraries only for data not present in the selected roster export.
4. Official Warhammer 40,000 11th-edition metadata is used to validate static library names, DP, Force Dispositions and Enhancement points.

Unit Library entries are parser overrides/exceptions, not a duplicate canonical unit database. A unit missing from Unit Library is therefore not an error when its ROSZ data is complete.
