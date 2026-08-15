# Astartes Forge v3.0.21 — Artwork Frame Fit & Layering

This release corrects how the three active A4 chapter frames are composited with the live datasheet content.

## Renderer order

1. A4 page / selected print surface
2. chapter artwork at exactly 210 × 297 mm
3. transparent live-content wrapper
4. only the actual information panels and title text

The old 226 × 317 mm overscan has been removed, so the full outer border of Space Wolves, Ultramarines and Blood Angels remains visible. The background surface now appears only through transparent pixels in the artwork rather than as a second rectangular body canvas.
