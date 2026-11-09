/** Represents a semantic version in major.minor.patch form. */
export type SemanticVersion = `${number}.${number}.${number}`;

/** Normalizes a name into a lowercase, URL-friendly entity identifier. */
export function makeEntityId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "entity";
}
