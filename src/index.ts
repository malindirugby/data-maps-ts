/** Exposes core identifiers, metadata types, and definition helpers. */
export * from "./core/identifiers.js";
export * from "./core/metadata/attribute.js";
export * from "./core/metadata/entity.js";
export * from "./core/metadata/relationship.js";
export * from "./core/primitives/string.js";
export * from "./core/primitives/number.js";
export * from "./core/primitives/boolean.js";
export * from "./core/primitives/date.js";
/** Exposes domain definitions and person schemas. */
export * from "./domains/people/index.js";
export * from "./domains/organizations/index.js";
export * from "./domains/locations/index.js";
export * from "./domains/employment/index.js";
export * from "./relationships/person-organization.js";
export * from "./relationships/person-location.js";
/** Exposes validation, classification, and usage policy lookups. */
export * from "./policies/validation/index.js";
export * from "./policies/classification/index.js";
export * from "./policies/usage/index.js";
export * from "./registry/index.js";
