# Changelog

## v2.8.2 — Provenance-Aware Source Integrity
- Fixed false `source ownership changed` failures for legitimate identical weapon-profile merges.
- Integrity validation now treats the lossless Source Graph as ownership authority.
- Merged presentation rows are validated through complete source-profile provenance sets.
- Added source-profile coverage checks so genuinely missing ROSZ weapon profiles still fail.
- Weapon characteristics are cross-checked against every source profile represented by a merged row.
- Merged counts are checked against the summed provenance counts when provenance is available.

## v2.8.1 — Source Integrity & Completeness
- Replaced wording-based Precise values and distances validation with source-integrity validation.
- Cross-checks selection/profile/rule ownership after normalisation.
- Cross-checks weapon Range, Attacks, Skill, Strength, AP, Damage and source counts against the ROSZ source graph.
- Adds Source intact / Source ambiguity / Data loss detected states.
- Valid Warhammer wording such as 'within range of an objective' no longer produces a false failure.
- No rules text is rewritten or guessed by the validator.

# Changelog

## v2.8.0 — Chapter Scope & First Founding Expansion
- Added 12 verified Space Marine / First Founding detachment entries.
- Added New Recruit-derived chapter scope metadata and resolver.
- Added Ultramarines, Imperial Fists, Salamanders, Iron Hands, Raven Guard and White Scars verification modules.
- Updated generic Adeptus Astartes verification coverage from 10 to 15 detachments.
- Added concise printable Stratagem/Enhancement fallbacks for all 12 detachments.
- Added official MFM enhancement metadata while preserving New Recruit as authority where chapter catalogue disposition differs.
- Added 12 ROSZ fixtures and chapter-scope corpus audit.
- Verification scope now builds dynamically from Chapter Library modules.

v2.7.1
- Source-first Army Rule Resolver (including Templar Vows).
- Precision-validator fix for explicit `improve ... by N` modifiers.


## v2.6.2 — Context-Aware Validation
- Fixed false-positive precision failures for named/objective-marker range terminology.
- Retains structure-aware v2.6.1 data model unchanged.

## v2.6.1 — Structure-Aware Data Model

- Preserves New Recruit parent/child ownership after normalization instead of flattening relationships.
- Adds per-unit structured source trees for models, weapons, abilities, rules and enhancements.
- Adds detachment source trees and source-selection links to the normalized Army Model.
- Detachment rule rendering now preserves source order between prose, sub-rules and restrictions.
- Structure validation accepts legitimate rules expressed through sub-rules while still rejecting restriction-only records.
- Precision validation understands “within range of an objective marker” as rules terminology instead of an omitted inch value.
- Source & Edition Inspector now reports preserved ownership links and Structure-Aware Model status.
- Added a structure corpus audit across the complete ROSZ regression suite.

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

## v2.7.0 — Black Templars Module
- Added Black Templars as a first-class Chapter module in the Unified/Structure-Aware engine.
- Added verification support for Marshal's Household, The Living Miracle, Wrathful Procession, Companions of Vehemence, Godhammer Assault Force and Vindication Task Force.
- Added current concise Enhancement and Stratagem reference data for all six Black Templars detachments.
- Kept Detachment Rules, roster composition, model/weapon data and attachment eligibility New Recruit-first.
- Current New Recruit metadata is authoritative for updated disposition values, including The Living Miracle = Disruption and Godhammer Assault Force = Purge the Foe.
- Added seven Black Templars ROSZ regression files including a multi-detachment stress test.
- Expanded verification scope from 33 to 39 detachments.
- Regression corpus now audits 49 roster files (48 unique).

## v2.9.0 — Chapter Identity & Card Design Engine
- Rebuilt Stratagem cards around a physical-card inspired hierarchy.
- Reworked Army/Detachment rule typography into bullets.
- Added parchment surfaces and dimensional banner treatment.
- Added per-chapter/faction datasheet emblems.
- Added Chapter Decoration Packs and theme controls.
- Retained v2.8.2 provenance-aware Source Integrity unchanged.


## v2.9.2
- Generic source-hierarchy detachment rule renderer.
- Published Chapter heraldry image slots.
- Fuller Chapter ornament packs; intensity slider removed.
- Stronger phase-colour Stratagem cards and centered spine labels.

## v2.9.2
- Fixed Card Material selector and Chapter emblem identity persistence.
- Simplified Chapter preset list.
- Improved Army Forge attachment controls and Enhancement labels.
- Expanded Chapter ornamentation, led by a full Space Wolves Fenrisian treatment.
