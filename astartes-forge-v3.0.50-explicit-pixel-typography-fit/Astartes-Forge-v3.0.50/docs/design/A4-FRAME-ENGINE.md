# Astartes Forge — Clean A4 Artwork Renderer

From v3.0.23 onward the A4 + Artwork path is independent from the legacy `.data-card` renderer. From v3.0.33 its frame contract is governed by `a4-chapter-frame-gold-v1`.

## Layer order

1. A4 full-page background colour (White / Parchment / Chapter Light)
2. Full 210 × 297 mm chapter artwork frame
3. Live title and points text
4. Individual live stats / weapons / abilities / rules / keywords panels

There is **no opaque content-container layer** between artwork and live panels.

## Artwork sizing

- PNG: 2480 × 3508 RGBA
- Physical output: exactly 210 × 297 mm
- Overscan: 0 mm
- Crop / zoom: none
- Outer page edge: straight, opaque and full bleed

## Golden Frame Standard

The three visual references are Space Wolves, Ultramarines and Blood Angels. Their exact files are locked by SHA-256. New chapters must conform to `docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json` and retain a chapter-native transparent opening.

Run:

```bash
python3 tests/scripts/validate-frames.py
python3 tests/scripts/verify-golden-frame-standard.py
```

before setting a new Chapter to `frameReady: true`.
