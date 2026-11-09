import type { PrimitiveDefinition } from "@core/metadata/attribute.ts";

/** Provides the default metadata for free-form text values. */
export const stringPrimitive = {
  type: "string",
  label: "String",
  description: "A free-form text value.",
  validation: {
    minLength: 0,
  },
} as const satisfies PrimitiveDefinition<"string", string>;

/** Builds a string attribute while fixing its data type. */
export const stringAttribute = <TValue extends string = string>(
  attribute: Omit<PrimitiveDefinition<"string", TValue>, "type">,
): PrimitiveDefinition<"string", TValue> => ({
  type: "string",
  ...attribute,
});
