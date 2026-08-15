# Astartes Forge v3.0.12 — Print Button Fix

## Fixed
- Forge Army Pack now opens the browser print dialog directly from the Print tab button click.
- Removed the deferred `requestAnimationFrame` call around `window.print()` in the Army Pack flow, preventing browsers from silently ignoring the print action.

## Scope
- No renderer, theme, roster, rules, or library behavior was changed.
- v3.0.11 remains otherwise intact.
