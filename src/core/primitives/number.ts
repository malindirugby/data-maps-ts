import type { PrimitiveDefinition } from "@core/metadata/attribute.ts";

/** Provides the default metadata and non-negative constraint for numbers. */
export const numberPrimitive = {
  type: "number",
  label: "Number",
  description: "A numeric value.",
  validation: {
    minimum: 0,
  },
} as const satisfies PrimitiveDefinition<"number", number>;

/** Builds a numeric attribute while fixing its data type. */
export const numberAttribute = <TValue extends number = number>(
  attribute: Omit<PrimitiveDefinition<"number", TValue>, "type">,
): PrimitiveDefinition<"number", TValue> => ({
  type: "number",
  ...attribute,
});
