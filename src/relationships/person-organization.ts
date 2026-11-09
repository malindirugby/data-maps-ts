import { defineRelationship } from "@core/metadata/relationship.ts";

/** Models the many-to-many association between people and organizations. */
export const personOrganizationRelationship = defineRelationship({
  id: "person-organization",
  name: "person to organization",
  kind: "many-to-many",
  sourceEntity: "person",
  targetEntity: "organization",
  description: "A person may be associated with one or more organizations.",
});
