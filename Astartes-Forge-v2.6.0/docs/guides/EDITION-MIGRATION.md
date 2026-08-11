# Edition migration guide

Astartes Forge treats New Recruit as the primary roster-data source. Edition-specific interpretation lives in `src/libraries/editions/edition-schema-library.js`.

## When a new edition appears

1. Import an early New Recruit roster into **Source & Edition Inspector**.
2. Export the inspection JSON.
3. Add a new edition schema rather than changing the old schema.
4. Map new/renamed unit and weapon characteristics.
5. Update only reference libraries for rules that New Recruit does not export.
6. Run the existing ROSZ regression suite plus new-edition smoke/stress rosters.

The presentation and print layers should not require changes unless Games Workshop changes the actual datasheet information model.
