# Astartes Forge v3.0.19 — Blood Angels Frame Integration

## Summary

v3.0.19 adds the first approved Blood Angels A4 portrait artwork frame to the shared chapter artwork pipeline.

## What changed

- Added `assets/art/blood-angels/frames/blood-angels-a4-portrait.png`.
- Registered the Blood Angels frame in `chapter-visual-registry.js`.
- Preserved the shared `space-wolves-a4-master-v1` pixel geometry so the title field, side intrusion, and inner opening align with Space Wolves and Ultramarines.
- Blood Angels now auto-switches from ROSZ import to its own Chapter Light surface and A4 artwork frame.

## Design language

Blood Angels uses: crimson enamel, antique gold, parchment, wing motifs, blood-drop heraldry, gothic reliquary details, wax seals, and chalice iconography.

## Validation

The build is intended to pass the existing library, registry, frame, and chapter-scope checks.
