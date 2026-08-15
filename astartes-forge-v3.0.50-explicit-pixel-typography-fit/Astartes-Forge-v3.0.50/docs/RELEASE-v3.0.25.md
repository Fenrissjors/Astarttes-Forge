# Astartes Forge v3.0.25 — Space Wolves Native Opening Repair

v3.0.25 is a focused asset repair on top of the clean A4 artwork renderer.

## Space Wolves

The Space Wolves frame contained baked pale/icy background pixels immediately below the title plaque and above the footer. Those areas were opaque, while the Ultramarines and Blood Angels equivalents use their native transparent openings. This reduced usable visual clearance even though the live-content coordinates were correct.

The repair changes **only the alpha channel** of the existing Space Wolves artwork. RGB artwork content is untouched. Light background regions connected to the main opening are made transparent while dark frame ornamentation, wolf pelts, runes, icicles, side wolves, rocks and the central footer emblem remain present.

## Unchanged

- Ultramarines A4 artwork
- Blood Angels A4 artwork
- ROSZ chapter auto-detection
- A4 clean artwork renderer
- A4 without artwork
- A5 renderer
- rules/unit libraries
