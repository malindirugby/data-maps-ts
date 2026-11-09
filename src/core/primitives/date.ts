import type { PrimitiveDefinition } from "@core/metadata/attribute.ts";

/** Provides the default metadata and date-format constraint for dates. */
export const datePrimitive = {
  type: "date",
  label: "Date",
  description: "A date value with no time component.",
  validation: {
    format: "date",
  },
} as const satisfies PrimitiveDefinition<"date", string>;

/** Builds a date attribute while fixing its data type. */
export const dateAttribute = <TValue extends string = string>(
  attribute: Omit<PrimitiveDefinition<"date", TValue>, "type">,
): PrimitiveDefinition<"date", TValue> => ({
  type: "date",
  ...attribute,
});
