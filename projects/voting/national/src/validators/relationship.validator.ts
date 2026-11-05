import type { Citizen, CitizenId, } from "../types/citizen.types.ts";

export interface RelationshipRepository {
  findCitizenById(
    citizenId: CitizenId
  ): Promise<Citizen | null>;

  isRelationshipVerified(
    verificationId: string,
    subjectId: CitizenId,
    relatedCitizenId: CitizenId,
    relationshipType: "PARENT" | "GUARDIAN"
  ): Promise<boolean>;

  isAlternativeVerificationApproved(
    caseReference: string,
    citizenId: CitizenId,
    approvingOfficerId: string
  ): Promise<boolean>;
}

export interface RelationshipValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export async function validateCitizenRelationships(
  citizen: Citizen,
  repository: RelationshipRepository
): Promise<RelationshipValidationResult> {
  const errors: string[] = [];

  if (citizen.relationships.length === 0) {
    return {
      valid: false,
      errors: ["No relationship or alternative verification provided."],
    };
  }

  for (const relationship of citizen.relationships) {
    if (relationship.type === "ALTERNATIVE_VERIFICATION") {
      const approved =
        await repository.isAlternativeVerificationApproved(
          relationship.caseReference,
          citizen.identity.citizenId,
          relationship.approvingOfficerId
        );

      if (!approved) {
        errors.push("Alternative verification is not approved.");
      }

      continue;
    }

    const relatedCitizenId =
      relationship.type === "PARENT"
        ? relationship.parentCitizenId
        : relationship.guardianCitizenId;

    if (relatedCitizenId === citizen.identity.citizenId) {
      errors.push("A citizen cannot be their own parent or guardian.");
      continue;
    }

    const relatedCitizen =
      await repository.findCitizenById(relatedCitizenId);

    if (!relatedCitizen) {
      errors.push(
        `${relationship.type} record does not exist.`
      );
      continue;
    }

    if (relatedCitizen.verificationStatus !== "VERIFIED") {
      errors.push(
        `${relationship.type} identity has not been verified.`
      );
      continue;
    }

    const verified =
      await repository.isRelationshipVerified(
        relationship.relationshipVerificationId,
        citizen.identity.citizenId,
        relatedCitizenId,
        relationship.type
      );

    if (!verified) {
      errors.push(
        `${relationship.type} relationship evidence is invalid.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}