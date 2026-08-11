# Astartes Forge — New Recruit Data Audit

Audited **30 unique ROSZ exports** from the supplied Generic Astartes, Space Wolves and multi-detachment test sets.

## Primary findings

1. **ROSZ must remain the primary source of truth.** Unit composition, quantities, profiles, weapon characteristics, local weapon rules, costs, categories, faction keywords, enhancements and selected detachments are already encoded in the XML hierarchy.

2. **The selection hierarchy is meaningful data.** A profile or rule must be associated with its nearest owning selection, then model, then top-level unit. Global text matching should never assign rules or keywords across siblings.

3. **Same-name profiles are not duplicates.** Weapon selections can legitimately contain ranged and melee profiles with the same display name (for example Foehammer). Identity must use selection ID + profile ID, not name.

4. **Rules Library is a fallback, not a replacement.** It should provide detachment Stratagems and other content omitted by ROSZ, while imported rules, enhancements, points and selected detachments retain priority.

5. **Faction and Chapter keywords are unit-local.** Never infer a Chapter keyword from roster metadata and inject it into every unit. Merge attached model keywords for display only where the card explicitly represents those attached models.


## Observed XML inventory

### Selection types

- `upgrade`: 1727
- `model`: 448
- `unit`: 99

### Profile types

- `Ranged Weapons`: 815
- `Abilities`: 754
- `Melee Weapons`: 461
- `Unit`: 406
- `Transport`: 13

### Common local weapon rules

- `Oath of Moment`: 306
- `Pistol`: 149
- `Close-quarters`: 125
- `Rapid Fire`: 108
- `Leader`: 103
- `Twin-linked`: 84
- `Devastating Wounds`: 74
- `Deep Strike`: 74
- `Heavy`: 60
- `Anti`: 60
- `Hazardous`: 59
- `Assault`: 53
- `Deadly Demise D3`: 53
- `Blast`: 50
- `Support`: 36
- `Psychic`: 30
- `Precision`: 23
- `Hover`: 21
- `Deadly Demise D6`: 21
- `Torrent`: 21
- `Sustained Hits`: 17
- `Ignores Cover`: 15
- `Firing Deck 2`: 12
- `Assigned Agents`: 12
- `Feel No Pain 6+`: 7
- `Extra Attacks`: 7
- `Deadly Demise 1`: 6
- `Feel No Pain 5+`: 6
- `Lethal Hits`: 6
- `Infiltrators`: 6
- `Scouts 7"`: 6
- `One Shot`: 6
- `Indirect Fire`: 6
- `Melta`: 3
- `Deadly Demise 2D6`: 1

## Data ownership map

| Data | Primary ROSZ location | Normalisation | Library fallback |
|---|---|---|---|
| Roster name / catalogue | `roster` and `force` attributes | Trim display text | No |
| Detachments and DP | Selected configuration subtree + Detachment Point costs | Canonical alias only | Metadata/aliases |
| Detachment rule | Direct rules/profiles inside selected detachment subtree | Structured rule object | Yes, only if omitted |
| Detachment Stratagems | Usually absent in ROSZ | WHEN/TARGET/EFFECT cards | Yes |
| Enhancement selection / points | Exact enhancement selection subtree and costs | Attach to selected model/unit | Reference text only if omitted |
| Unit identity | Top-level roster selection IDs | Stable imported ID from source IDs | Alias validation only |
| Model quantity | Model selections and `number` attribute | Group equal statlines at render time | No |
| Model statline | Unit/Model profile owned by model selection | Canonical M/T/SV/W/LD/OC keys | Validation only |
| Weapon identity | Weapon selection ID + weapon profile ID | Keep ranged/melee profiles separately | No |
| Weapon keywords | Rules/characteristics local to the exact weapon selection/profile | Canonical spelling + dedupe | Validation only |
| Unit abilities | Rules/profiles owned by exact model or unit selection | Filter core/weapon keywords | Ability alias validation |
| Leader / Support | Unit-local categories/rules and attachment selections | Separate roles; allow both on one bodyguard | Validation only |
| Faction keywords | Unit-local category links | Separate faction footer | Never infer from roster |

## Current importer risks identified

- Unit detection considers any top-level selection containing nested Unit/Model profiles; configuration selections can therefore be misidentified unless category/type/path exclusions are applied.
- Points are summed from all descendant costs. This can double-count when both parent and child selections expose rolled-up costs; source cost ownership should be retained and reconciled.
- Every Character is currently allowed to lead every non-Character imported unit. Leader eligibility should come from explicit New Recruit constraints/selection links where available; otherwise mark eligibility as unknown rather than universal.
- Model ownership currently relies partly on `type="model"`; some companion or support entries may use other selection types. Ownership should use nearest profile-bearing selection plus categories and source IDs.
- Ability filtering is name/regex based. The importer should first classify rules by exact owning selection and profile type, then use the Keyword Library only for rendering.
- Weapon keyword extraction currently prioritises profile text and may miss local `<rule>` elements. Both sources should be retained separately and merged only for that exact weapon selection.
- Chapter labels above cards and faction footers must be generated from the represented unit/model source categories, never roster catalogue or detachment identity.

## Recommended canonical import object

```text
RosterSource
  forces[]
  selections[] (sourceId, entryId, entryGroupId, type, number, path)
  profiles[] (source profile ID, owner selection ID, type, characteristics)
  rules[] (source rule ID, owner selection ID, text)
  categories[] (owner selection ID)
  costs[] (owner selection ID)

NormalizedArmy
  detachments[]
  units[]
    models[]
      statProfile
      weapons[]
        profiles[]
        localRules[]
        keywords[]
      abilities[]
      keywords[]
    attachments[] (leader/support)
```


## Required implementation sequence

1. Preserve a lossless source graph with IDs and ownership links.
2. Build normalized units from the graph without discarding source references.
3. Classify exact-local weapon rules and profiles.
4. Resolve model roles and attachments from source data.
5. Resolve all selected detachments independently.
6. Merge Rules Library fallbacks field-by-field only where ROSZ is absent.
7. Render datasheets from the normalized model, not by re-reading free text.
8. Run regressions across all supplied single- and multi-detachment rosters.