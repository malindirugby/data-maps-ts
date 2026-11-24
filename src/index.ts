/** Exposes core identifiers, metadata types, and definition helpers. */
export * from "../src/core/identifiers.js";
export * from "../src/core/metadata/attribute.js";
export * from "../src/core/metadata/entity.js";
export * from "../src/core/metadata/relationship.js";
export * from "../src/core/primitives/string.js";
export * from "../src/core/primitives/number.js";
export * from "../src/core/primitives/boolean.js";
export * from "../src/core/primitives/date.js";
/** Exposes domain definitions and person schemas. */
export * from "../src/domains/people/index.js";
export * from "../src/domains/organizations/index.js";
export * from "../src/domains/locations/index.js";
export * from "../src/domains/employment/index.js";
export * from "./relationships/person-organization.js";
export * from "./relationships/person-location.js";
/** Exposes validation, classification, and usage policy lookups. */
export * from "../src/policies/validation/index.js";
export * from "../src/policies/classification/index.js";
export * from "../src/policies/usage/index.js";
export * from "../src/registry/index.js";
