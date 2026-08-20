# Astartes Forge v4.1 — Multifaction Production

Print-first Warhammer 40,000 army companion for New Recruit `.rosz` rosters.

Astartes Forge now supports three production-validated factions — **Adeptus Astartes**, **Orks** and **Tyranids** — through the same shared import, datasheet, rules, theme and print architecture.

## Supported factions

### Adeptus Astartes

- Full New Recruit roster import and Chapter detection.
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

### Tyranids

- Full New Recruit faction detection and roster import.
- Leaders, Support attachments, Enhancements and attachment relationships.
- Army rule, all validated Tyranids detachments, Detachment Rules, Enhancements and Stratagems.
- Generic ROSZ keyword import pipeline now preserves effective unit keywords from source categories, including detachment-provided keywords.
- Faction keywords remain available to rules logic while being omitted from the datasheet footer when redundant.
- Shared rich-text cleanup removes escaped New Recruit formatting markers from datasheets and print output.
- Tyranids-specific palette while preserving the neutral application chrome.
- Validated 2480×3508 Tyranids A4 artwork frame registered in the Visual Registry and Geometry Library.
- Adaptive A4 artwork rendering now supports any validated non-Astartes faction through the shared production contract.
- Theme Preview and Forge Army Pack validated against the same adaptive renderer path.

## Core features

- Import `.rosz`, `.ros`, `.xml` and recognised `.json` roster exports.
- Automatic faction/chapter, unit, role, attachment, Enhancement and detachment interpretation.
- Readable datasheets with adaptive fitting for dense unit combinations.
- Rules & Stratagems view with exact phase filtering and phase-specific visual presentation.
- Theme controls for clean A4/A5 layouts, artwork availability and faction/chapter presentation.
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
- **Orks** and **Tyranids** use the shared faction contract plus faction-specific rules and visual registration.
- Validated non-Astartes artwork profiles use the same adaptive A4 renderer as validated Astartes frames.
- The app UI remains uniform when switching factions; faction colours are limited to roster content and print presentation.

## Artwork production standard

Validated A4 artwork uses the locked 2480×3508 production pipeline with native-pixel title geometry, full-bleed outer edges and a controlled transparent content opening.

The renderer is geometry-driven: artwork defines the frame and title/points zones, while the datasheet renderer remains shared across factions.

Production flow:

`generation → correction → 2480×3508 → geometry validation → production registration → runtime routing`

## Current status

**v4.1 — Multifaction Production**

- Adeptus Astartes: production-ready.
- Orks: production-ready.
- Tyranids: production-ready.
- Shared import, keyword, datasheet, rules, theme, artwork and print architecture proven across three substantially different factions.

See `CHANGELOG.md` for release history and `ROADMAP.md` for the next expansion phase.
