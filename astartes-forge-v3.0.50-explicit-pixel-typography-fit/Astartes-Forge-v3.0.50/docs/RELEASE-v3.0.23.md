# Astartes Forge v3.0.23 — Clean A4 Artwork Renderer

## Purpose

Remove the historical renderer overlap that allowed legacy `.data-card` CSS to paint opaque blocks or crop chapter artwork.

## A4 + Artwork DOM

```text
.artwork-print-page
├── .artwork-print-background   # full 210 × 297 mm selected surface
├── .artwork-print-frame        # exact 210 × 297 mm chapter PNG
├── .artwork-print-title        # live unit/chapter/points text only
└── .artwork-print-panels       # transparent positioning flow
    ├── stats boxes
    ├── ranged weapons
    ├── melee weapons
    ├── abilities
    ├── rules
    └── keywords
```

The `.artwork-print-panels` element is always transparent. Only actual information boxes receive the selected White, Parchment, or Chapter Light surface.

## Unchanged renderers

- Datasheets tab: existing functional `.data-card` renderer.
- A4 without artwork: existing clean `.data-card` print renderer.
- A5: existing artwork-free A5 renderer.

## Artwork

Space Wolves, Ultramarines, and Blood Angels assets are unchanged from v3.0.22.
