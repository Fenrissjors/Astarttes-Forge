# Gold Master Audit — 2026-08-07

## Scope

The audit covers the current supported/verified Generic Adeptus Astartes, Space Wolves and Blood Angels modules, the current Keyword/Attachment/Chapter/Unit override libraries, all included New Recruit regression exports, and the print-first application engine.

## New Recruit corpus

`tests/scripts/audit_rosz.py` scanned all test rosters without inferring missing game data. The generated machine-readable result is `tests/audit/rosz-corpus-audit.json`.

At build time the corpus contained 33 files / 32 unique files by SHA-256. Observed Deadly Demise forms included `Deadly Demise 1`, `Deadly Demise D3`, `Deadly Demise D6` and `Deadly Demise D6+2`.

## Library policy

- Rules Library: static fallback/reference only.
- Keyword Library: renderer classification of universal/core keywords; no game-effect prose is needed on datasheets for these.
- Unit Library: parser exception/override registry, deliberately not a duplicate unit database.
- Attachment Library: name normalization/parser for eligibility text; eligibility itself comes from New Recruit.
- Chapter Library: module/verification metadata only; never injects chapter faction keywords into unrelated units.

## Cross-reference results

- Current official MFM metadata was used for DP, Force Disposition, enhancement names and enhancement points for supported entries.
- Current 11th-edition Space Wolves Faction Pack required replacing the previous Champions of Fenris fallback with The Great Wolf Watches, A Giant Amongst Giants, Preyslayer, and the three current Stratagems.
- The June 2026 Core Rules were used to refresh concise Core Stratagem references.
- The user-supplied 11th-edition keyword cheat sheet was used as a secondary completeness checklist; official Core Rules remain authoritative when wording differs.

## Automated tests

Run:

```bash
node tests/scripts/verify-libraries.js
python tests/scripts/audit_rosz.py
```

The Gold Master build passes its library and keyword regression checks before packaging.
