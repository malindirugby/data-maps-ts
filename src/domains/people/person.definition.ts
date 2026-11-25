import { defineEntity } from "../../core/metadata/entity.js";
import { personAttributes } from "./person.types.js";

/** Combines person metadata and attributes into an entity definition. */
export const PersonDefinition = defineEntity({
  id: "person",
  version: "1.0.0",
  name: "Person",
  description: "An individual human being represented in the data map.",
  attributes: personAttributes,
});

/** Exposes the inferred type of the person entity definition. */
export type PersonDefinitionType = typeof PersonDefinition;
