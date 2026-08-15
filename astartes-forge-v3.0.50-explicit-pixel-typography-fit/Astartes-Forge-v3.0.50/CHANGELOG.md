# Changelog

## v3.0.50 — Explicit Pixel Typography Fit

- Fixed the A4 fitter resetting to full size because structural `scrollHeight` did not track the actual rendered panel bottoms.
- A4 overflow validation now uses only real panel bounding boxes against the physical page bottom.
- Dark Angels A4 typography now receives explicit final point sizes (12pt description baseline and proportionate headers/tables) instead of relying on nested scale multiplication.
- Added a bracket-and-binary-search fitter that keeps the largest actual pixel-fitting size and never resets to 1.0 when a smaller size is still required.
- Panel width remains fixed at 160.5 mm.

## v3.0.49 — Flat Flow Pixel Fit

- Fixed the A4 pixel fitter for composed/dense datasheets, which use a flat body flow instead of codex main/side columns.
- Flat compositions now scale the true master `--print-scale`, so profile labels, stats, headers, descriptions, padding and tables all actually shrink together.
- Weapon tables remain independently compressible before the master scale is reduced.
- Added an effect check so a scale step only counts when the measured rendered pixel height really decreases.
- Added a generic master fallback for any future user-created composition that still exceeds A4.
- Panel width remains fixed at 160.5 mm.

## v3.0.48 — Panel-to-Pixel Fit

- Replaced A4 density prediction with a panel-to-pixel validator for adaptive artwork datasheets.
- Full-size 12pt description text is retained whenever the rendered panels fit.

## v3.0.47 — Dense Dark Angels Overflow Guard

- Added measured overflow guards for dense Dark Angels composite datasheets.

## v3.0.46 — Adaptive Panel Sizing Pass

- Introduced the 12pt A4 description baseline and adaptive vertical fitting.
- Removed redundant Description labels from ability text.
