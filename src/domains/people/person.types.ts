import type { AttributeDefinition } from "@core/metadata/attribute.ts";

/** Declares the metadata and validation rules for person attributes. */
export const personAttributes = {
  firstName: {
    type: "string",
    label: "First name",
    description: "The person's legal or preferred first name.",
    required: true,
    validation: { minLength: 1 },
    classification: "identity",
    sensitivity: "internal",
  },
  lastName: {
    type: "string",
    label: "Last name",
    description: "The person's family name.",
    required: true,
    validation: { minLength: 1 },
    classification: "identity",
    sensitivity: "internal",
  },
  email: {
    type: "string",
    label: "Email address",
    description: "Primary contact address for the person.",
    required: true,
    validation: { format: "email" },
    classification: "contact",
    sensitivity: "confidential",
  },
  dateOfBirth: {
    type: "date",
    label: "Date of birth",
    description: "The date the person was born.",
    required: false,
    validation: { format: "date" },
    classification: "identity",
    sensitivity: "internal",
  },
  isActive: {
    type: "boolean",
    label: "Active",
    description: "Whether the person is currently active in the system.",
    required: true,
    defaultValue: true,
  },
} as const satisfies Record<string, AttributeDefinition>;

/** Captures the literal types of the person attribute definitions. */
export type PersonAttributes = typeof personAttributes;

/** Defines the data shape stored for a person record. */
export type PersonRecord = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  isActive: boolean;
};
