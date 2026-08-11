# Astartes Forge v2.4.6 — Developer Dashboard Scope Fix

- Fixed `renderDataQualityDashboard is not defined` after successful roster imports.
- Root cause: the dashboard functions had accidentally become nested inside `clearImportedData()` due to a missing function boundary.
- Restored `clearImportedData()`, `collectKeywordQuality()` and `renderDataQualityDashboard()` as separate top-level functions.
- No datasheet, rules-library, print, attachment or weapon-profile logic changed.
