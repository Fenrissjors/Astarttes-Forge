# Astartes Forge v3.0.14 — A4 Full-Bleed Frame

## Scope
This release intentionally focuses on the A4 portrait Forge Army Pack renderer.

## Changed
- A4 physical page remains exactly 210 × 297 mm.
- A4 artwork frame is rendered with overscan beyond the physical page.
- The A4 card clips that overscan at the paper edge, so artwork is visibly cropped at the left, right, top and bottom edges.
- Removed all A4 page/card margin and padding from the print master.
- `@page` remains A4 portrait with 0 mm margin.
- A5 landscape renderer is unchanged in this release.

## Renderer geometry
- Physical page: 210 × 297 mm
- Artwork layer: 226 × 317 mm
- Horizontal overscan: 8 mm per side
- Vertical overscan: 10 mm per side
