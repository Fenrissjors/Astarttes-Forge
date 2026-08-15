# Astartes Forge v2.4.2 — Hierarchical Detachment Rules

## Changed
- Detachment Rules can contain one or more top-level rules and any number of sub-rules.
- `Restrictions:` appended inside a New Recruit rule description are rendered as a separate section without hiding the actual rule text before them.
- Bullet/sub-rule lines remain children of their parent Detachment Rule.
- Verification now accepts flexible rule counts (`min: 1`) instead of assuming exactly one Detachment Rule.
- Developer verification reports top-level rule, sub-rule and restriction counts per detachment.

## Blood Angels regression fix
Legacy of Grace, Encarmine Speartip and Wrath of the Doomed now preserve both the rule body and the restrictions exported in the same New Recruit `<rule>` element.
