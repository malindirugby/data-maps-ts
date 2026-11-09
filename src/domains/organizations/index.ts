/** Defines the identifying and public-domain fields for an organization. */
export const organizationDefinition = {
  id: "organization",
  version: "1.0.0",
  name: "Organization",
  description: "A legal or operating body represented in the map.",
  attributes: {
    name: {
      type: "string",
      label: "Organization name",
      required: true,
      validation: { minLength: 1 },
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Primary public domain for the organization.",
      required: false,
      validation: { format: "url" },
    },
  },
};
