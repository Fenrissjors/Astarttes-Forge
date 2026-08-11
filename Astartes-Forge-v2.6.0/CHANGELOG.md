# Changelog

## v2.6.0 — Dark Angels Module
- Added all 8 current Dark Angels detachments to the central Rules Library.
- Added 8 Dark Angels verification rosters plus a stress-test roster.
- New Recruit remains authoritative for selected Detachment Rules, units, weapons, keywords, enhancements and attachments.
- Added compact fallback Stratagem/Enhancement references for Dark Age Arsenal, Darkflight Pursuit, Interrogation Conclave, Company of Hunters, Inner Circle Task Force, Lion's Blade Task Force, Unforgiven Task Force and Wrath of the Rock.
- Extended Chapter Coverage and Verification Dashboard to Dark Angels.

## 2.5.0 — Source & Edition Inspector
- Added edition-schema library and explicit New Recruit game-system detection.
- Added compact Source & Edition Inspector to Developer Mode.
- Added schema fingerprinting for profile types and characteristics.
- Added unknown-field migration warnings and exportable source-inspection JSON.
- Added Chapter discovery and ROSZ-vs-library fallback overview.
- Preserved all v2.4.7 rendering, rules, datasheet and print behaviour.


## v2.4.7 — Rules Render & Dedup Fix
- Canonical WHEN / TARGET / EFFECT / optional RESTRICTION Stratagem card rendering.
- Consolidated duplicate structured fields from New Recruit.
- Robust detachment-rule deduplication against Army Rules.
- Restored safe post-import UI rendering while keeping dashboard scope fix.

## v2.4.3 — Gold Master
- Added Gold Master official metadata reference library.
- Added ROSZ corpus audit and expanded library verification tests.
- Fixed Deadly Demise D6+2 classification and expanded 11th-edition keyword coverage.
- Removed duplicate inline detachment fallback databases.
- Refreshed current 11th-edition Core Stratagem concise references.
- Updated Champions of Fenris, Anvil Siege Force, Legends of Saga and Song, and Veterans of the Fang metadata.
- Renamed Unit Library coverage in Developer Mode to Parser overrides to reflect its intended role.
- Reorganized source, library, test and documentation directories.

## v2.4.4 — Datasheet Structure
- Added title-only Rules section to datasheets, preserving New Recruit Abilities / Rules / Keywords separation.
- Restored Deadly Demise visibility without core-rule explanation text.
- Added imported Enhancement badges to Characters in Army Forge.
- Added Invulnerable Save shield display above the normal Save characteristic using exact ROSZ data.

## v2.5.1 — Datasheet Cleanup
- Parameterised weapon keyword families are deduplicated per weapon profile. Source priority is exact profile characteristic, then weapon-name bracket, then exact local weapon rule.
- Single-unit datasheets no longer repeat the unit name in stat, weapon, ability, and rule section labels.
- Combined Leader/Support/bodyguard sheets retain explicit model/source labels for clarity.
