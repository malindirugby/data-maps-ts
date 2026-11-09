import { defineRelationship } from "@core/metadata/relationship.ts";

/** Models the many-to-many association between people and locations. */
export const personLocationRelationship = defineRelationship({
  id: "person-location",
  name: "person to location",
  kind: "many-to-many",
  sourceEntity: "person",
  targetEntity: "location",
  description: "A person may be connected to multiple locations.",
});
