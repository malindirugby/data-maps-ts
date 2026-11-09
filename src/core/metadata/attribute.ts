/** Supported value types for an attribute. */
export type DataType = "string" | "number" | "boolean" | "date" | "enum" | "object";

/** Built-in formats that can be used to validate an attribute. */
export type ValidationFormat = "email" | "url" | "uuid" | "date" | "datetime";

/** Data sensitivity categories used to classify an attribute. */
export type SensitivityLevel = "public" | "internal" | "confidential" | "restricted";

/** Optional rules for validating an attribute's value. */
export interface ValidationConstraints {
  readonly format?: ValidationFormat;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly pattern?: string;
  readonly enumValues?: readonly string[];
}

/** Describes an attribute's type, presentation, defaults, and metadata. */
export interface AttributeDefinition<
  TType extends DataType = DataType,
  TValue = unknown,
> {
  readonly type: TType;
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly defaultValue?: TValue;
  readonly validation?: ValidationConstraints;
  readonly classification?: string;
  readonly sensitivity?: SensitivityLevel;
  readonly usage?: string;
  readonly examples?: readonly TValue[];
}

/** Alias for an attribute definition with a specific value type. */
export type PrimitiveDefinition<TType extends DataType, TValue = unknown> =
  AttributeDefinition<TType, TValue>;

/** Returns a definition unchanged while preserving its inferred types. */
export function defineAttribute<TType extends DataType, TValue>(
  attribute: AttributeDefinition<TType, TValue>,
): AttributeDefinition<TType, TValue> {
  return attribute;
}
