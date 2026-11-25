import { PersonDefinition } from "../domains/people/person.definition.js";
import { organizationDefinition } from "../domains/organizations/index.js";
import { locationDefinition } from "../domains/locations/index.js";
import { employmentDefinition } from "../domains/employment/index.js";

/** Provides a central lookup table for all registered entity definitions. */
export const dataMapRegistry = {
  person: PersonDefinition,
  organization: organizationDefinition,
  location: locationDefinition,
  employment: employmentDefinition,
} as const;

/** Returns the registered definition for an entity identifier, if present. */
export function getEntityDefinition(entityId: string) {
  return dataMapRegistry[entityId as keyof typeof dataMapRegistry];
}
