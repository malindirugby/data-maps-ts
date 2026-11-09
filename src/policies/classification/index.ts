/** Describes the supported data classification categories. */
export const classificationPolicies = {
  identity: {
    label: "Identity",
    description: "Data that identifies a person or organization.",
  },
  contact: {
    label: "Contact",
    description: "Data used to communicate with a subject.",
  },
};

/** Returns a category's description or a message when it is not defined. */
export function describeClassification(key: string): string {
  return classificationPolicies[key as keyof typeof classificationPolicies]?.description ?? "No classification rule defined.";
}
