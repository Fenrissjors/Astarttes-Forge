# Astartes Forge v2.4 testing

## Primary regression sets

### Generic Adeptus Astartes
Run the existing 10 Generic verification ROSZ files in Developer Mode → Live Batch Test Lab.

### Space Wolves
Run all 7 Space Wolves detachment ROSZ files plus the existing multi-detachment/stress rosters.

### Blood Angels
Run:
- Blood Angels 01 - Legacy of Grace.rosz
- Blood Angels 02 - Encarmine Speartip.rosz
- Blood Angels 03 - Wrath of the Doomed.rosz
- Blood Angels 04 - Angelic Host.rosz
- Blood Angels 05 - The Lost Brethren.rosz
- Blood Angels 06 - Angelic Inheritors.rosz
- Blood Angels 07 - Liberator Assault Group.rosz
- Blood Angels 08 - Rage-cursed Onslaught.rosz
- Blood Angels Stress Test.rosz

Expected per-detachment library counts are defined in `rules-library.js`. The stress roster must validate every imported Detachment, not only the first one.

## Manual checks
- Chapter keywords must come only from each unit's ROSZ categories.
- Support units must be attached; Leaders may remain unattached.
- Attachment eligibility must follow the ROSZ Leader/Support profile.
- Model and weapon quantities must reflect ROSZ selection counts.
- Identical weapon profiles may merge only if all profile characteristics and local weapon keywords match.
- Combined datasheet layout toggle must work in both screen and Army Pack output.
