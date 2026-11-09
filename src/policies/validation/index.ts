/** Maps validation rule names to their format and human-readable description. */
export const validationPolicies = {
  email: {
    format: "email",
    description: "Validates that the value is a syntactically correct email address.",
  },
  uuid: {
    format: "uuid",
    description: "Validates that the value is a UUID.",
  },
};

/** Returns a rule's description or a message when the rule is not defined. */
export function describeValidation(rule: string): string {
  return validationPolicies[rule as keyof typeof validationPolicies]?.description ?? "No validation rule defined.";
}
