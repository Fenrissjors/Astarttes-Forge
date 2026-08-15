# Astartes Forge v3.0.18 — Unified Chapter Visual Registry

v3.0.18 is an architecture release for the upcoming multi-Chapter artwork pass. It intentionally preserves the visual output of v3.0.17.

## What changed

- Added `src/libraries/chapters/chapter-visual-registry.js`.
- Consolidated Chapter theme palette, Chapter Light surface, heraldry source, artwork identity and seamless A4 frame route into one profile per Chapter.
- Routed ROSZ Chapter detection through the visual registry.
- Updated `decoration-pack-library.js` and `a4-frame-engine.js` to consume the registry.
- Kept generic successor-Chapter detection behaviour compatible with v3.0.17: names such as Blood Ravens remain visible as faction labels while using the generic Astartes visual profile until a dedicated profile is added.
- Added A4 artwork placeholders for all registered Chapters. Only Space Wolves is marked frame-ready in this release.

## Golden visual reference

Space Wolves remains unchanged:

- same approved `space-wolves-a4-portrait.png`;
- same A4 full-bleed/overscan geometry;
- same Chapter colours and Chapter Light surface;
- same title-plaque alignment;
- same A5 artwork-free presentation.

## Adding the next frame

A future Chapter frame now requires only the asset plus one registry value, for example:

```js
'ultramarines': {
  // ...existing profile...
  artwork: {
    label:'Macragge laurels',
    decorationLabel:'LAURELS · ROMAN ORNAMENT',
    a4Frame:'assets/art/ultramarines/frames/ultramarines-a4-portrait.png',
    frameReady:true
  }
}
```

No Chapter-specific renderer branch should be needed.

## Verification

- 51 verification detachments internally consistent.
- 52 ready/reference detachments synchronized.
- ROSZ corpus audit: 61 files / 60 unique SHA-256.
- Chapter Visual Registry regression suite: PASS.
- Space Wolves A4 frame validation: PASS.
- JavaScript syntax checks: PASS.

## Ultramarines artwork integration build

- Added approved Ultramarines / Macragge A4 full-bleed frame.
- Registered Ultramarines as `frameReady` in the Unified Chapter Visual Registry.
- Ultramarines ROSZ imports now route automatically to Ultramarines colours, Chapter Light, emblem identity and A4 frame.
- Space Wolves remains unchanged as the golden reference.
- A4 title text is placed inside the artwork's integrated title plaque for both frame-ready Chapters.
