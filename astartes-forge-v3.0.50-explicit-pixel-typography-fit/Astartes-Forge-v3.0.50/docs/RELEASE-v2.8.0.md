# Astartes Forge v2.8.0 — Chapter Scope & First Founding Expansion

## Purpose

Extend the verified Space Marine rules coverage while preserving New Recruit's actual catalogue availability. The engine does not infer chapter legality from detachment flavour or names.

## New scope registry

The Chapter Library now indexes each verification detachment to the module/context in which the supplied New Recruit roster made it available.

Generic:
- Armoured Speartip
- Bastion Task Force
- Ceramite Sentinels
- Headhunter Task Force
- Orbital Assault Force

Chapter-scoped:
- Ultramarines — Blade of Ultramar, Reclamation Force
- Imperial Fists — Emperor's Shield
- Salamanders — Forgefather's Seekers
- Iron Hands — Hammer of Avernii
- Raven Guard — Shadowmark Talon
- White Scars — Spearpoint Task Force

Scope is diagnostic metadata. Roster legality remains New Recruit's responsibility.

## Source priority

1. Exact ROSZ source graph and selected New Recruit data.
2. Structure-aware normalized model.
3. Rules Library fallback for printable data absent from ROSZ.
4. Current reference metadata for names, Enhancement costs and regression expectations.

Where public Space Marine metadata and the supplied chapter-scoped New Recruit catalogue disagree on Force Disposition, the selected New Recruit roster remains authoritative in Astartes Forge.

## Regression results

- 51 verification detachments internally consistent.
- 52 ready/reference detachments synchronized.
- 61 ROSZ files audited, 60 unique by SHA-256.
- Structure-aware ownership confirmed in all 61 fixtures.
- 12/12 new chapter-scope fixtures match the selected New Recruit metadata.
