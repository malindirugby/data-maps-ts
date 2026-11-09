import { describe, expect, it, vi } from "vitest";

import { validateCitizenRelationships, type RelationshipRepository, } from "../src/validators/relationship.validator.ts";

import type {
  Citizen,
  CitizenId,
  IdentityReference,
} from "../src/types/citizen.types.ts";

const citizenId = (value: string) =>
  value as CitizenId;

function createCitizen(
  id: string,
  status: Citizen["verificationStatus"] = "VERIFIED"
): Citizen {
  return {
    identity: {
      citizenId: citizenId(id),
      fullName: "Test Citizen",
      dateOfBirth: "1990-01-01",
      nationality: "KE",
      identityReference: `test-reference-${id}` as IdentityReference,
    },
    address: {
      county: "Nairobi",
      constituency: "Test Constituency",
      ward: "Test Ward",
      registrationCentreId: "TEST-CENTRE",
    },
    relationships: [],
    verificationStatus: status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe("Citizen relationship validation", () => {
  it("rejects a citizen with no relationship evidence", async () => {
    const citizen = createCitizen("citizen-1");

    const repository: RelationshipRepository = {
      findCitizenById: vi.fn(),
      isRelationshipVerified: vi.fn(),
      isAlternativeVerificationApproved: vi.fn(),
    };

    const result = await validateCitizenRelationships(
      citizen,
      repository
    );

    expect(result.valid).toBe(false);
  });

  it("rejects a nonexistent guardian", async () => {
    const citizen: Citizen = {
      ...createCitizen("citizen-1"),
      relationships: [
        {
          type: "GUARDIAN",
          guardianCitizenId: citizenId("ghost-guardian"),
          relationshipVerificationId: "verification-1",
        },
      ],
    };

    const repository: RelationshipRepository = {
      findCitizenById: vi.fn().mockResolvedValue(null),
      isRelationshipVerified: vi.fn(),
      isAlternativeVerificationApproved: vi.fn(),
    };

    const result = await validateCitizenRelationships(
      citizen,
      repository
    );

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      "GUARDIAN record does not exist."
    );
  });

  it("rejects a guardian whose identity is not verified", async () => {
    const citizen: Citizen = {
      ...createCitizen("citizen-1"),
      relationships: [
        {
          type: "GUARDIAN",
          guardianCitizenId: citizenId("guardian-1"),
          relationshipVerificationId: "verification-2",
        },
      ],
    };

    const repository: RelationshipRepository = {
      findCitizenById: vi.fn().mockResolvedValue(
        createCitizen("guardian-1", "PENDING")
      ),
      isRelationshipVerified: vi.fn(),
      isAlternativeVerificationApproved: vi.fn(),
    };

    const result = await validateCitizenRelationships(
      citizen,
      repository
    );

    expect(result.valid).toBe(false);
  });

  it("rejects a citizen who references themselves as guardian", async () => {
    const citizen: Citizen = {
      ...createCitizen("citizen-1"),
      relationships: [
        {
          type: "GUARDIAN",
          guardianCitizenId: citizenId("citizen-1"),
          relationshipVerificationId: "verification-3",
        },
      ],
    };

    const repository: RelationshipRepository = {
      findCitizenById: vi.fn(),
      isRelationshipVerified: vi.fn(),
      isAlternativeVerificationApproved: vi.fn(),
    };

    const result = await validateCitizenRelationships(
      citizen,
      repository
    );

    expect(result.valid).toBe(false);
  });
});