# Roadmap

## Current milestone — v4.0 Multifaction Approved

Astartes Forge has proven that its import, datasheet, rules, theme and print architecture can support more than one faction without duplicating the application into faction-specific implementations.

### Completed

- Adeptus Astartes production baseline.
- Full Chapter-aware visual system and validated A4 artwork pipeline.
- Clean A4 and dedicated A5 datasheet layouts.
- Adaptive print fitting for dense datasheets.
- Leader / Support attachment handling and Enhancement presentation.
- Uniform application UI independent of faction/chapter colours.
- Per-datasheet colour overrides for clean A4 and A5.
- Phase-aware Stratagem presentation and exact phase filtering.
- Full Orks faction integration.
- All 13 Orks detachments validated with rules, Enhancements and Stratagems.
- Orks palette, emblem routing and validated production A4 artwork.
- Multifaction runtime proven with batch validation and stress-test rosters.

## Next major phase — Faction Expansion

The next priority is to add a **third faction** using the same contract, specifically to prove that the v4.0 architecture scales without adding one-off faction logic.

For each new faction, use the same completion standard:

1. New Recruit faction detection.
2. Roster import and datasheet verification.
3. Leader / Support / Enhancement behaviour.
4. Army rule and detachment recognition.
5. Faction Rules Library with detachment Stratagems and Enhancement references where New Recruit does not serialise them.
6. Faction default palette while preserving the neutral app UI.
7. Clean A4 and A5 print validation.
8. Optional production A4 artwork frame using the shared geometry contract.
9. Faction emblem routing.
10. Batch/stress validation before merge to `main`.

## Architecture priorities

- Continue moving from Chapter-specific naming toward truly faction-neutral interfaces where practical, without destabilising the proven Astartes implementation.
- Keep New Recruit as the primary source for selected roster facts.
- Keep static Rules Libraries limited to reference-completion that is missing from roster exports.
- Keep the shared datasheet and print renderer faction-agnostic.
- Keep faction identity in registries/presentation modules rather than hardcoded renderer branches.
- Preserve exact source-integrity and schema diagnostics as more unusual factions/profile types are introduced.

## Visual system priorities

- Reuse the locked 2480×3508 artwork production pipeline for future factions.
- Keep A5 artwork-free unless a future design decision explicitly changes that rule.
- Keep artwork availability opt-in: a faction only exposes the artwork option after a validated frame is registered.
- Continue using native-pixel title/points geometry and production manifests for every new frame.
- Consider moving remaining externally hosted faction/chapter emblems to controlled local assets in a future asset-management pass.

## Validation / maintenance priorities

- Add regression rosters for each newly supported faction.
- Expand automated checks around faction detection, Rules Library mapping and visual routing.
- Keep Space Marines and Orks as permanent regression baselines when adding future factions.
- Update stale documentation/known-issues entries as old v3 artwork limitations are retired.

## Architecture rule

> New Recruit decides what the roster contains. Faction and Chapter registries decide how it is interpreted and presented. Shared renderers must remain faction-agnostic wherever possible.
