# Astartes Forge v3.0.52 — Unified Adaptive Artwork

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

## v3.0.27

Chapter visuals now have one source of truth: `chapter-visual-registry.js`. ROSZ Chapter detection, theme colours, Chapter Light backgrounds, emblems, artwork identity and seamless A4 frame paths resolve through the same profile. The approved Space Wolves renderer/artwork is unchanged; every other Chapter now has a ready A4 frame slot that can be populated without renderer changes.

## v3.0.17

Two print-layout details are refined: the A5 Chapter emblem is now vertically centred in its existing title band, and clean A4 datasheets now use one consistent top-to-bottom panel flow for both standalone units and units with attached Leader/Support models. No artwork, import or rules-library behavior changed.

## v3.0.16

Print surfaces are now consistent across every light information box: Parchment, White or a pale Chapter-specific background. A4 keeps the approved Space Wolves artwork and full-bleed overscan when enabled; with artwork disabled the clean datasheet expands across the physical A4 page. A5 is now always artwork-free and uses a dedicated two-column tabletop datasheet layout instead of a scaled-down A4 card.

## v3.0.15

The approved Space Wolves A4 frame is now the active A4 Rand Artwork. The v3.0.14 full-bleed renderer is unchanged: the frame overscans the 210 × 297 mm page and is physically clipped at the page edge. The live unit title is aligned with the single integrated top plaque, while side ornaments may intentionally extend underneath content boxes. A5 is unchanged.

## v3.0.7

This release separates visual identity from the shared datasheet layout. Every card resolves a dedicated Chapter Decoration Pack. Space Wolves are the full benchmark pack: page-scale Fenrisian rune watermark, ice crown, wolf pelt, carved rune-bone and hanging talismans. Other Chapters already resolve to distinct non-Fenris packs, ready to be expanded independently.

Theme controls now independently toggle illustrated edge pieces and the background watermark. Card material, palette and banner depth never change the detected Chapter or its decoration pack.

The data/import/provenance engine is unchanged from v2.8.2.

## Architecture

`ROSZ → chapter-visual-registry.js → palette / Chapter Light / emblem / artwork frame → shared A4/A5 renderer`

See `docs/RELEASE-v3.0.18.md` and `docs/design/CHAPTER-VISUAL-REGISTRY.md`.

### Frame-ready Chapters in this v3.0.18 build
- Space Wolves — Fenris illustrated A4 frame
- Ultramarines — Macragge laurels A4 frame

Importing a matching ROSZ automatically selects the matching Chapter profile and A4 frame.

### A4 master frame geometry

Space Wolves, Ultramarines and Blood Angels jointly define the locked A4 Golden Frame Standard. New Chapter frames use `docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json`: 2480×3508, exact A4 full bleed, straight opaque page edges, one clear title plaque, a chapter-native connected opening, and the clean renderer stack. The three golden PNGs are SHA-256 locked so unrelated work cannot silently alter them.
