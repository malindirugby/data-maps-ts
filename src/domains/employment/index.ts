/** Defines the fields used to describe a person's employment. */
export const employmentDefinition = {
  id: "employment",
  version: "1.0.0",
  name: "Employment",
  description: "The relationship between a person and an organization.",
  attributes: {
    role: {
      type: "string",
      label: "Role",
      required: true,
      validation: { minLength: 1 },
    },
    startDate: {
      type: "date",
      label: "Start date",
      required: false,
      validation: { format: "date" },
    },
  },
};
