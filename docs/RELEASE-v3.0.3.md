
# Astartes Forge v3.0.3 — Art Pack Binding Fix

This release fixes the missing-artwork bug in V3.0.1/V3.0.2.

Root cause:
- the normal datasheet renderer correctly determined the Chapter;
- the A4 frame engine independently tried to detect it again from a smaller
  subset of unit fields;
- legacy array-style decoration slots were also passed to an object-style
  frame renderer.

Fix:
- `createCard`'s selected `data-decoration-pack` is now authoritative;
- all art slots are normalized into a plain `{slot: src}` map;
- raster Space Wolves pieces are mounted after live content/panels are built;
- a developer `inspectCodexArtwork()` helper reports mounted images and their
  natural dimensions.

No ROSZ/rules/provenance logic changed.
