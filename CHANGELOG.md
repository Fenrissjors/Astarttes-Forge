# Changelog

## v4.1 — Tyranids Expansion

- Added full **Tyranids** faction support to the production multifaction architecture.
- Added Tyranids faction detection and presentation registration from New Recruit roster metadata.
- Added a Tyranids Rules Library covering the validated detachment batch, including Detachment Rules, Enhancements and Stratagems.
- Added Tyranids detachment reference cleanup while keeping New Recruit authoritative for roster facts and effective unit state.
- Replaced one-off detachment keyword derivation with a generic ROSZ keyword import pipeline that reads effective unit/model categories from the source graph.
- Preserved imported keywords such as `Vanguard Invader` and other detachment-provided keywords without hardcoding faction-specific rules.
- Kept faction keywords available to rules/eligibility logic while omitting redundant faction keywords from the datasheet footer.
- Added shared cleanup for escaped New Recruit rich-text markers such as `**` and `^^` in datasheets and print output.
- Added a Tyranids-specific visual palette while preserving the uniform faction-neutral application UI.
- Added a validated **2480×3508 Tyranids A4 artwork frame** and registered it in the Visual Registry, frame manifest and Geometry Library.
- Fixed the shared artwork routing so validated non-Astartes factions can use the same adaptive A4 renderer as validated Astartes frames.
- Removed the old hardcoded non-Astartes artwork block from the faction/chapter runtime contract and replaced it with validated-profile gating.
- Verified Tyranids Theme Preview and Forge Army Pack rendering on the shared adaptive artwork path.
- Removed obsolete Crimson Fists and Flesh Tearers standalone artwork placeholder folders/presets from the current presentation set.
- Confirmed existing Adeptus Astartes and Orks behaviour remains operational after the shared keyword and artwork-routing changes.

## v4.0 — Multifaction Approved

- Promoted Astartes Forge from a Space Marine-focused application to a proven multifaction architecture.
- Added full **Orks** faction support alongside Adeptus Astartes.
- Added formal faction detection from New Recruit catalogue/faction/category metadata.
- Added a complete Orks Rules Library covering all **13 validated Orks detachments**.
- Added Orks detachment rules, Enhancement reference data and detachment Stratagems.
- Improved detachment-rule classification so generic keyword explanations such as Assault, Scouts and Sustained Hits are not incorrectly shown as Detachment Rules.
- Added schema support for special Orks profiles such as Dread Mob `Try Dat Button!` data.
- Corrected source-integrity coverage so duplicate source-profile references no longer generate false completeness warnings.
- Added Orks-specific default presentation colours while preserving the uniform faction-neutral application UI.
- Preserved individual datasheet colour overrides for clean A4 and A5 output, including automatic contrast and reset-to-faction-default behaviour.
- Added a validated 2480×3508 Orks A4 artwork frame using the shared production geometry pipeline.
- Registered Orks artwork in the geometry library, frame manifest and faction visual registry.
- Added Orks faction emblem routing for the Themes presentation.
- Kept A5 artwork-free and retained the dedicated clean A5 layout.
- Verified Orks across the full detachment batch plus a stress-test roster before merge to `main`.
- Confirmed existing Adeptus Astartes import, datasheet, rules, theme and print behaviour remains operational under the shared multifaction system.

## v3.x — Astartes production baseline

The v3 series established the production-ready Space Marine experience that v4.x now generalises across factions:

- Unified Chapter Visual Registry and chapter-aware presentation.
- Production A4 artwork frames and geometry validation.
- Shared adaptive A4 renderer and dedicated A5 clean renderer.
- 12pt description baseline with pixel-measured adaptive fitting for dense datasheets.
- Leader and Support attachment rendering.
- Datasheet colour overrides with contrast-aware text.
- Uniform application presentation independent of selected chapter.
- Phase-coloured Stratagem presentation and exact phase filtering.
- Forge Army Pack print/PDF workflow.

### v3.0.55 — Imperial Fists Frame

- Added validated Imperial Fists A4 artwork using the shared adaptive renderer and pixel geometry contract.
- Title field remains empty/emblem-free; no Chapter name is baked into artwork.
- Existing Golden references, Black Templars, A5, and A4 without artwork are unchanged.

### v3.0.54 — Black Templars Golden Frame

- Added the new Black Templars A4 artwork frame with a completely clear live-title plaque and no baked-in Chapter name.
- Added a Black Templars-native transparent opening and `artwork-geometry-px-v1` title geometry.
- Promoted Black Templars to the shared adaptive A4 datasheet renderer only after Golden Frame validation passed.
- Existing Space Wolves, Ultramarines, Blood Angels, and Dark Angels frame assets remain unchanged.

### v3.0.53 — Artwork Geometry Contract

- Every validated A4 artwork frame carries an exact native-pixel `titleBoxPx` in its frame manifest.
- The renderer converts native 2480×3508 PNG coordinates into physical A4 millimetres and fits long unit names inside that frame-defined title box.
- The 160.5 mm information-panel width remains unchanged.

### v3.0.52 — Unified Adaptive Artwork

- Validated Chapter frames share the adaptive A4 datasheet renderer.
- A5 and A4-without-artwork remain separate clean print paths.

### v3.0.51 — Measurable Print Fit

- Exposes the hidden physical print DOM off-screen before adaptive fitting so the fitter measures real page geometry.
- Runs the A4/A5 fit with synchronous layout passes before printing.

### v3.0.50 — Explicit Pixel Typography Fit

- A4 overflow validation uses rendered panel bounds against the physical page bottom.
- Added bracket/binary-search fitting to retain the largest typography scale that physically fits.

### v3.0.48 — Panel-to-Pixel Fit

- Replaced A4 density prediction with a panel-to-pixel validator for adaptive artwork datasheets.
- Full-size 12pt description text is retained whenever the rendered panels fit.
