/** Cardinalities supported for entity relationships. */
export type RelationshipKind =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many";

/** Describes a link between a source entity and a target entity. */
export interface RelationshipDefinition {
  readonly id: string;
  readonly name: string;
  readonly kind: RelationshipKind;
  readonly sourceEntity: string;
  readonly targetEntity: string;
  readonly description?: string;
  readonly required?: boolean;
}

/** Returns a relationship definition with its declared type. */
export function defineRelationship(
  relationship: RelationshipDefinition,
): RelationshipDefinition {
  return relationship;
}
