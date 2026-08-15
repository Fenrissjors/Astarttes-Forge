
# Astartes Forge v3.0.10 — Full Bleed & Theme Controls Fix

- Space Wolves print frames now bleed 4 mm beyond all physical page edges.
- The page clips the frame, producing a true edge-to-edge/cut-off appearance.
- Print text content is centred with `margin-left/right: auto` inside the validated content width.
- Theme controls were rebound directly to print-theme state and always trigger a full preview rebuild.
- Opening the Themes view refreshes controls and preview.
- Frame occlusion now fades artwork only where actual live panels overlap it.
- Datasheets tab remains artwork-free.
