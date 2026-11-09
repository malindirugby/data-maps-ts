import type { PrimitiveDefinition } from "@core/metadata/attribute.ts";

/** Provides the default metadata for boolean values. */
export const booleanPrimitive = {
  type: "boolean",
  label: "Boolean",
  description: "A true or false value.",
} as const satisfies PrimitiveDefinition<"boolean", boolean>;

/** Builds a boolean attribute while fixing its data type. */
export const booleanAttribute = <TValue extends boolean = boolean>(
  attribute: Omit<PrimitiveDefinition<"boolean", TValue>, "type">,
): PrimitiveDefinition<"boolean", TValue> => ({
  type: "boolean",
  ...attribute,
});
