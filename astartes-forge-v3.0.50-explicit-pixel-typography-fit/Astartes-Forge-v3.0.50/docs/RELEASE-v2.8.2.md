# Astartes Forge v2.8.2 — Provenance-Aware Source Integrity

This maintenance release corrects the v2.8.1 Source Integrity validator.

## Principle

The lossless ROSZ Source Graph owns exact source ownership. The Presentation Engine may combine identical rows, provided every contributing source profile remains traceable.

## Integrity outcomes

- **Source intact** — all relevant source profiles remain represented and values are unchanged.
- **Source ambiguity** — source data is preserved but the source itself contains a diagnostic warning.
- **Data loss detected** — a required source record is missing or a rules-relevant profile value changed.

Legitimate weapon aggregation is not data loss.
