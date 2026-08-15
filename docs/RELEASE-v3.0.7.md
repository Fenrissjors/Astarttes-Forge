
# Astartes Forge v3.0.7 — Theme Controls & True Frame Overlay

## Fixed
- Theme controls are directly bound to printTheme state and force immediate preview refresh.
- Opening Themes refreshes both controls and preview.
- Frame rendering no longer uses split slots, pseudo-art or cropped artwork.
- Exactly one full-page image is mounted as the frame overlay.
- The frame is positioned as `inset: 0; width: 100%; height: 100%` with no clipping or transforms.
- Normal Datasheets remain artwork-free.
- Theme Preview continues to use the same print renderer as Forge Army Pack.

No roster/rule/provenance logic changed.
