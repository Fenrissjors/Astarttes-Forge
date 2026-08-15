
# Astartes Forge v3.0.8 — Validated Frame Pipeline

The Space Wolves frame pipeline now uses two validated, single-image transparent frame assets cut from the approved combined artwork.

- A4 portrait: 2480 × 3508 px
- A5 landscape: 2480 × 1748 px
- Large transparent center for text-heavy datasheets
- Legacy ornaments asset directory removed
- Single source of truth: assets/art/space-wolves/frames/frame-manifest.json
- Pixel validator: tests/scripts/validate-frames.py
- Validator checks exact size/orientation, alpha safe-zone transparency, and artwork coverage on all four outer edges
- Datasheets remain artwork-free; frames are used by Theme Preview / print rendering only
