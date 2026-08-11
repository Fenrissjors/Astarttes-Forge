# v2.4.1 — Detachment Rule Fix & Compact Developer Workspace

## Detachment rule source priority

1. Exact direct rule/profile below the selected New Recruit detachment selection.
2. Detachment-related imported rule scan only if the exact selection contains no rule.
3. Astartes Forge Rules Library fallback only if New Recruit did not export a usable rule.

This prevents cross-detachment rule leakage in single- and multi-detachment rosters.

## Developer Mode

Developer tools are grouped into four collapsible panels. Opening one panel closes the other developer panels, reducing vertical scrolling.

## Project structure

The release archive now separates application source, libraries, styles, tests and documentation into dedicated subfolders.
