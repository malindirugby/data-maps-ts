/** Exposes core identifiers, metadata types, and definition helpers. */
export * from "@core/identifiers.ts";
export * from "@core/metadata/attribute.ts";
export * from "@core/metadata/entity.ts";
export * from "@core/metadata/relationship.ts";
export * from "@core/primitives/string.ts";
export * from "@core/primitives/number.ts";
export * from "@core/primitives/boolean.ts";
export * from "@core/primitives/date.ts";
/** Exposes domain definitions and person schemas. */
export * from "@domains/people/index.ts";
export * from "@domains/organizations/index.ts";
export * from "@domains/locations/index.ts";
export * from "@domains/employment/index.ts";
export * from "./relationships/person-organization.ts";
export * from "./relationships/person-location.ts";
/** Exposes validation, classification, and usage policy lookups. */
export * from "@policies/validation/index.ts";
export * from "@policies/classification/index.ts";
export * from "@policies/usage/index.ts";
export * from "@registry/index.ts";
