/** Describes the supported purposes for using data. */
export const usagePolicies = {
  operational: {
    label: "Operational",
    description: "Used to support day-to-day business processing.",
  },
  analytical: {
    label: "Analytical",
    description: "Used for reporting, trends, and analysis.",
  },
};

/** Returns a usage purpose's description or a message when it is not defined. */
export function describeUsage(key: string): string {
  return usagePolicies[key as keyof typeof usagePolicies]?.description ?? "No usage policy defined.";
}
