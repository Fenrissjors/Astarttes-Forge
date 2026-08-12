# Astartes Forge v2.9.3 — Illustrated Datasheet Framework

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

## v2.9.3

This release separates visual identity from the shared datasheet layout. Every card resolves a dedicated Chapter Decoration Pack. Space Wolves are the full benchmark pack: page-scale Fenrisian rune watermark, ice crown, wolf pelt, carved rune-bone and hanging talismans. Other Chapters already resolve to distinct non-Fenris packs, ready to be expanded independently.

Theme controls now independently toggle illustrated edge pieces and the background watermark. Card material, palette and banner depth never change the detected Chapter or its decoration pack.

The data/import/provenance engine is unchanged from v2.8.2.

## Architecture

`chapter/faction detection → decoration-pack-library.js → illustrated slots (header / corner / footer / watermark / accent) → shared A4 datasheet renderer`

See `docs/RELEASE-v2.9.3.md`.
