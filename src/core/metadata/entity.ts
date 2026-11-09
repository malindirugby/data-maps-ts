import type { AttributeDefinition } from "./attribute.ts";
import type { RelationshipDefinition } from "./relationship.ts";

/** Describes an entity and the attributes and relationships it exposes. */
export interface EntityDefinition<
  TAttributes extends Record<string, AttributeDefinition> = Record<string, AttributeDefinition>,
> {
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly description?: string;
  readonly attributes: TAttributes;
  readonly relationships?: readonly RelationshipDefinition[];
}

/** Returns an entity definition unchanged while preserving its attribute types. */
export function defineEntity<TAttributes extends Record<string, AttributeDefinition>>(
  entity: EntityDefinition<TAttributes>,
): EntityDefinition<TAttributes> {
  return entity;
}
