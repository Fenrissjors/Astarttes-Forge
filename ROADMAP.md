# Roadmap

## Current milestone — v4.1 Multifaction Production

Astartes Forge has now proven its shared import, keyword, datasheet, rules, theme, artwork and print architecture across three substantially different factions:

- Adeptus Astartes
- Orks
- Tyranids

### Completed

- Adeptus Astartes production baseline.
- Full Chapter-aware visual system and validated A4 artwork pipeline.
- Clean A4 and dedicated A5 datasheet layouts.
- Adaptive print fitting for dense datasheets.
- Leader / Support attachment handling and Enhancement presentation.
- Uniform application UI independent of faction/chapter colours.
- Per-datasheet colour overrides for clean A4 and A5.
- Phase-aware Stratagem presentation and exact phase filtering.
- Full Orks faction integration and all 13 validated detachments.
- Full Tyranids faction integration with validated detachment batch, rules and Stratagems.
- Generic ROSZ keyword import pipeline for effective unit/model categories and detachment-provided keywords.
- Validated Orks and Tyranids production A4 artwork through the shared geometry contract.
- Generic validated non-Astartes adaptive artwork routing.
- Multifaction runtime proven with batch validation and stress-test rosters while retaining Adeptus Astartes and Orks as regression baselines.

## Next major phase — Continued Faction Expansion

The architecture is now proven beyond the original two-faction milestone. The next priority is to keep adding factions without reintroducing one-off renderer or importer logic.

For each new faction, use the same completion standard:

1. New Recruit faction detection.
2. Roster import and datasheet verification.
3. Leader / Support / Enhancement behaviour.
4. Army rule and detachment recognition.
5. Verify effective unit keywords directly from ROSZ source categories before adding any derived-rule logic.
6. Faction Rules Library only where reference data is missing from the roster export.
7. Faction default palette while preserving the neutral app UI.
8. Clean A4 and A5 print validation.
9. Optional production A4 artwork frame using the shared geometry contract and validated-profile gating.
10. Faction emblem routing where appropriate.
11. Batch/stress validation before merge to `main`.

## Architecture priorities

- Continue moving from Chapter-specific naming toward faction-neutral interfaces where practical, without destabilising the proven Astartes implementation.
- Keep New Recruit as the primary source for selected roster facts and effective unit keywords.
- Keep static Rules Libraries limited to reference-completion that is genuinely absent from roster exports.
- Keep the shared datasheet and print renderer faction-agnostic.
- Keep faction identity in registries/presentation modules rather than hardcoded renderer branches.
- Keep artwork access contract-driven: only production-validated profiles may enter the adaptive artwork renderer.
- Preserve exact source-integrity and schema diagnostics as more unusual factions/profile types are introduced.

## Visual system priorities

- Reuse the locked 2480×3508 artwork production pipeline for future factions.
- Keep A5 artwork-free unless a future design decision explicitly changes that rule.
- Keep artwork availability opt-in and validation-gated.
- Continue using native-pixel title/points geometry and production manifests for every new frame.
- Consider moving remaining externally hosted faction/chapter emblems to controlled local assets in a future asset-management pass.

## Validation / maintenance priorities

- Add and retain regression rosters for every supported faction.
- Expand automated checks around faction detection, ROSZ keyword projection, Rules Library mapping and visual routing.
- Keep Adeptus Astartes, Orks and Tyranids as permanent regression baselines when adding future factions.
- Continue removing obsolete branch-era compatibility code when shared contracts replace faction-specific workarounds.
- Keep README, changelog, roadmap and known-issues documentation aligned with production `main`.

## Architecture rule

> New Recruit decides what the roster contains. Faction and Chapter registries decide how it is interpreted and presented. Shared renderers must remain faction-agnostic wherever possible.
