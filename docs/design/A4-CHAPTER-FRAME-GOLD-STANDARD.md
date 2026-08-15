# A4 Chapter Frame Golden Standard — v1

From Astartes Forge v3.0.33 onward, **Space Wolves, Ultramarines and Blood Angels together are the immutable visual references for A4 chapter artwork**. None of the three is allowed to act as a destructive alpha-mask master for another Chapter.

## The required stack

A4 print pages with artwork are always built as:

1. full 210 × 297 mm background colour;
2. full 210 × 297 mm chapter frame PNG;
3. live title/points text;
4. individual live stats, weapon, ability, rule and keyword panels.

There is no opaque content-container layer between the frame and the individual panels.

## Hard frame rules

- **Raster:** 2480 × 3508 px RGBA.
- **Physical output:** exactly 210 × 297 mm; zero overscan, zero artwork zoom/crop.
- **Outer A4 edge:** all four edges are fully occupied by opaque artwork. The visible outer boundary is straight and aligned with the page.
- **No outside protrusions:** ears, wings, horns, chains, weapons, etc. must be designed inside that straight A4 boundary, never clipped by it.
- **One title plaque:** a single continuous light/quiet title field at the top. Never split it around an emblem.
- **Centre emblem:** sits above the title field; visual intrusion into usable title-text space is limited to roughly 5 px.
- **Native opening:** every Chapter owns its own connected transparent inner opening. Never transplant another Chapter's alpha mask.
- **No side holes:** page background must not leak through secondary transparent cuts in the rails/footer.
- **Inward detail is allowed:** side ornaments can project into the opening and can be covered by live panels.
- **Footer is sacrificial:** lower decoration should avoid critical focal detail because dense datasheets can overlap it.
- **No live data baked into artwork.**

## Golden-reference lock

The exact PNGs for Space Wolves, Ultramarines and Blood Angels are SHA-256 locked in `A4-CHAPTER-FRAME-GOLD-STANDARD.json`. A routine change to another Chapter must not alter those files.

## New-frame workflow

1. Start from the A4 Golden Standard proportions, not from an arbitrary illustration.
2. Design a straight full-bleed outer frame inside 2480 × 3508 px.
3. Reserve one uninterrupted title field.
4. Keep the chapter-native central opening transparent and connected.
5. Preserve a visually forgiving lower border and allow side ornaments to intrude inward.
6. Add the asset + manifest with `frameStandard: a4-chapter-frame-gold-v1`.
7. Run `python3 tests/scripts/validate-frames.py` and `python3 tests/scripts/verify-golden-frame-standard.py`.
8. Manually inspect the outer corners/title plaque once.
9. Only then set `frameReady: true` in the visual registry.

The JSON specification is the machine-readable authority; this document is its human-readable companion.
