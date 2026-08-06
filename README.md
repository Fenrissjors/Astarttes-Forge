# Astartes Forge v2.4.1

Open `index.html` in a browser.

## Folder structure

- `index.html` — application entry point
- `assets/css/` — visual styling
- `src/` — application code
- `src/libraries/` — Rules, Chapter, Keyword, Unit and Attachment libraries
- `tests/rosters/generic/` — Generic Adeptus Astartes verification rosters
- `tests/rosters/space-wolves/` — Space Wolves verification rosters
- `tests/rosters/blood-angels/` — Blood Angels verification rosters
- `tests/rosters/multi-detachment/` — multi-detachment and stress-test rosters
- `tests/verify-libraries.js` — library consistency check
- `docs/` — audit, testing and version documentation

## v2.4.1 changes

- Detachment Rules are now taken from the exact selected detachment node in the New Recruit ROSZ whenever available. Rules from another detachment can no longer bleed into the current entry.
- Rules Library remains the fallback only when the exact selected detachment has no exported Detachment Rule.
- Developer Mode is split into compact collapsible sections: Batch Test Lab, Library Coverage, Current Roster Verification, and Diagnostics & Inspector.
- The downloadable project is organised into clear source, library, test and documentation folders.
