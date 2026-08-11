# Astartes Forge v2.5.1 — Datasheet Cleanup

This maintenance release leaves the Source & Edition Inspector and rules libraries unchanged.

## Weapon keyword authority
For one weapon profile, parameterised keyword families such as Rapid Fire, Sustained Hits, Melta, Blast, Cleave and Anti-X are shown only once. When New Recruit exposes the same family through multiple presentation layers, Astartes Forge uses the most specific source in this order:

1. exact weapon profile characteristic;
2. keyword embedded in the exact weapon profile name;
3. rule owned by the exact weapon selection.

No number is invented by Astartes Forge.

## Cleaner single-unit cards
A standalone unit already has its name in the card header. Its body therefore uses neutral labels (`Ranged Weapons`, `Melee Weapons`, `Abilities`, `Rules`) and hides a redundant single stat-profile label. Combined datasheets retain source model names.
