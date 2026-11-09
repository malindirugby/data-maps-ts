import { describe, expect, it } from "vitest";
import { PersonDefinition } from "../src/domains/people/person.definition.js";

describe("Person definition", () => {
  it("exposes the canonical entity metadata", () => {
    expect(PersonDefinition.id).toBe("person");
    expect(PersonDefinition.version).toBe("1.0.0");
    expect(PersonDefinition.attributes.email.label).toBe("Email address");
  });

  it("defines validation semantics independent of UI concerns", () => {
    expect(PersonDefinition.attributes.email.validation?.format).toBe("email");
    expect(PersonDefinition.attributes.isActive.defaultValue).toBe(true);
  });
});
