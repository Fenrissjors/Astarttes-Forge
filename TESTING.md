# Astartes Forge v1.5 Test Lab

## Quick test
1. Open `index.html`.
2. Import a roster from `test-rosters/`.
3. Open **Developer Mode**.
4. Press **Run full test**.
5. Inspect failed checks and export the detailed test report.

## What the full test checks
- application boot and required controls
- Rules Library loading
- captured JavaScript errors
- roster metadata and detachment mapping
- model statblocks and weapon profile completeness
- datasheet card count
- detachment rule and Stratagem count
- theme colour contrast
- Army Pack generation without opening the print dialog
- browser-state serialisation

A failed check includes a concrete detail. Upload the exported JSON report when reporting a bug.
