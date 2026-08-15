# Chapter Visual Registry

`src/libraries/chapters/chapter-visual-registry.js` is the visual routing layer between imported ROSZ identity and the shared renderer.

## Data flow

```text
ROSZ faction / catalogue / unit tags
              ↓
       Chapter detection
              ↓
   Chapter Visual Registry
       ↙      ↓       ↘
   palette  heraldry  artwork
      ↓        ↓         ↓
 Chapter Light        A4 frame path
          \            /
           shared renderer
```

## Profile contract

Each registered Chapter provides:

- `id` and display `name`;
- detection `aliases`;
- `theme` values used by the existing theme engine;
- pale `printSurface` used by Chapter Light;
- `emblem` source metadata;
- `artwork.label` and `artwork.decorationLabel`;
- `artwork.a4Frame` for the seamless physical A4 renderer;
- `artwork.frameReady` as content status metadata.

## Golden rule

Do not add `if (chapter === ...)` renderer branches to support a new frame. Add the asset to the Chapter profile instead.

## Current frame readiness

- Space Wolves: ready / approved.
- Ultramarines: slot ready.
- Blood Angels: slot ready.
- Dark Angels: slot ready.
- Black Templars: slot ready.
- Imperial Fists: slot ready.
- Salamanders: slot ready.
- White Scars: slot ready.
- Raven Guard: slot ready.
- Iron Hands: slot ready.
- Deathwatch / Crimson Fists / Flesh Tearers / Generic Astartes: registry-ready, no approved seamless frame yet.
