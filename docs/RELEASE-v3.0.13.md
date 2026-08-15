# Astartes Forge v3.0.13 — Print Center Event Binding Repair

## Fixed

- Fixed the **Forge Army Pack** button in the Print tab not responding.
- Root cause: application event binding aborted on the removed legacy `#printCards` control before `#generateArmyPack` could receive its click handler.
- Legacy removed Theme controls (`#resetTheme`, `#resetUnitTheme`) are now also guarded so they cannot abort startup.
- Kept the direct `window.print()` call introduced in v3.0.12.

## Scope

No renderer, ROSZ import, rules library, detachments, or artwork behavior was changed.
