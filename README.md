# Astartes Forge v4.0 — Multifaction Approved

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

Astartes Forge has reached its first true multifaction milestone. The application now supports both **Adeptus Astartes** and **Orks** through the same shared import, datasheet, rules, theme and print pipeline.

## Supported factions

### Adeptus Astartes

- Full New Recruit roster import and chapter detection.
- Leaders, Support attachments and Enhancements.
- Army rules, detachments and Stratagems.
- Clean A4 and dedicated A5 datasheets.
- Individual datasheet colour overrides with automatic contrast and reset-to-default.
- Production artwork frames for the approved Space Marine visual set, including Generic Space Marines.
- Shared adaptive A4 artwork renderer with locked production geometry.

### Orks

- Full faction detection from New Recruit metadata.
- Leaders, Support attachments and Enhancements.
- Army rule and all **13 validated Orks detachments**.
- Detachment Rules, Enhancements and Stratagems through the Orks Rules Library.
- Orks-specific default palette while keeping the application UI faction-neutral.
- Clean A4 and A5 print layouts.
- Validated Orks A4 artwork frame and faction emblem routing.
- Full batch and stress-test validation completed before promotion to `main`.

## Core features

- Import `.rosz`, `.ros`, `.xml` and recognised `.json` roster exports.
- Automatic faction/chapter, unit, role, attachment, Enhancement and detachment interpretation.
- Readable datasheets with adaptive fitting for dense unit combinations.
- Rules & Stratagems view with exact phase filtering and phase-specific visual presentation.
- Theme controls for clean A4/A5 layouts, artwork availability and chapter/faction emblems.
- Per-datasheet colour coding for A5 and clean A4 cards, with automatic contrast handling.
- Forge Army Pack for printable army reference packs and PDF output.
- Developer validation tools for roster regression, source integrity, edition/schema inspection and artwork geometry.

## Multifaction architecture

The application no longer assumes that every roster is a Space Marine army.

```text
New Recruit roster
      ↓
Faction detection
      ↓
Faction / Chapter presentation registry
      ↓
Shared datasheet + rules + print renderers
      ↓
Faction-specific rules, palette, emblem and optional artwork pack
```

Current implementation:

- **Adeptus Astartes** uses the Chapter system and Chapter Visual Registry.
- **Orks** uses the shared faction contract plus its own rules and visual registration.
- The app UI remains uniform when switching factions; faction colours are limited to roster content and print presentation.

## Artwork production standard

Validated A4 artwork uses the locked 2480×3508 production pipeline with native-pixel title geometry, full-bleed outer edges and a controlled transparent content opening.

The shared renderer stays geometry-driven: artwork defines the frame and title/points zones, while the datasheet renderer remains reusable across supported factions.

Orks now follows the same production process as the approved Astartes frames:

`generation → correction → 2480×3508 → geometry validation → production registration → runtime routing`

## Current status

**v4.0 — Multifaction Approved**

- Adeptus Astartes: production-ready.
- Orks: production-ready.
- Shared import, datasheet, rules, print and theme architecture proven across two substantially different factions.

See `CHANGELOG.md` for release history and `ROADMAP.md` for the next expansion phase.
