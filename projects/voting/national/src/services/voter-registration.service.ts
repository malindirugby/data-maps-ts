import type {
  Citizen,
  CitizenId,
  KenyaCounty,
} from "../types/citizen.types.js";

import type {
  VoterCard,
  VoterEligibilityResult,
  VoterRegistrationRequest,
} from "../types/voter-card.types.js";

import {
  validateCitizenShape,
} from "../validators/citizen.validator.js";

import {
  validateCitizenRelationships,
  type RelationshipRepository,
} from "../validators/relationship.validator.js";

import {
  IdentityService,
} from "./identity.service.js";

export interface CitizenRepository {
  findById(
    citizenId: CitizenId
  ): Promise<Citizen | null>;
}

export interface EligibilityService {
  checkEligibility(
    citizen: Citizen
  ): Promise<VoterEligibilityResult>;
}

export interface VoterRepository {
  findByCitizenId(
    citizenId: CitizenId
  ): Promise<VoterCard | null>;

  issueCardAtomically(
    request: VoterRegistrationRequest
  ): Promise<VoterCard>;
}

export interface RegistrationPolicy {
  canRegisterAtCentre(
    citizen: Citizen,
    registrationCentreId: string,
    county: KenyaCounty
  ): Promise<boolean>;
}

export class VoterRegistrationService {
  constructor(
    private readonly citizens: CitizenRepository,
    private readonly relationships: RelationshipRepository,
    private readonly identity: IdentityService,
    private readonly eligibility: EligibilityService,
    private readonly voters: VoterRepository,
    private readonly registrationPolicy: RegistrationPolicy
  ) {}

  async register(
    request: VoterRegistrationRequest
  ): Promise<VoterCard> {
    // 1. Resolve the citizen from trusted storage.
    const citizen = await this.citizens.findById(
      request.citizenId
    );

    if (!citizen) {
      throw new Error("Citizen record does not exist.");
    }

    // 2. Check basic record integrity.
    const shape = validateCitizenShape(citizen);

    if (!shape.valid) {
      throw new Error(
        `Citizen validation failed: ${shape.errors.join("; ")}`
      );
    }

    // 3. Require independently verified identity.
    const identityResult =
      await this.identity.verifyCitizenIdentity(citizen);

    if (!identityResult.verified) {
      throw new Error("Citizen identity is not verified.");
    }

    if (citizen.verificationStatus !== "VERIFIED") {
      throw new Error(
        "Citizen registration verification is incomplete."
      );
    }

    // 4. Verify parent, guardian, or approved alternative path.
    const relationshipResult =
      await validateCitizenRelationships(
        citizen,
        this.relationships
      );

    if (!relationshipResult.valid) {
      throw new Error(
        `Relationship validation failed: ${
          relationshipResult.errors.join("; ")
        }`
      );
    }

    // 5. Check actual legal eligibility.
    const eligibility =
      await this.eligibility.checkEligibility(citizen);

    if (!eligibility.eligible) {
      throw new Error(
        `Voter eligibility failed: ${eligibility.reasons.join("; ")}`
      );
    }

    // 6. Validate registration centre and county.
    const centreAllowed =
      await this.registrationPolicy.canRegisterAtCentre(
        citizen,
        request.registrationCentreId,
        request.county
      );

    if (!centreAllowed) {
      throw new Error(
        "Invalid or unauthorized registration centre."
      );
    }

    // 7. Early duplicate check.
    const existing = await this.voters.findByCitizenId(
      citizen.identity.citizenId
    );

    if (existing) {
      throw new Error(
        "A voter registration already exists for this citizen."
      );
    }

    // 8. The repository must enforce uniqueness again
    //    inside a database transaction.
    return this.voters.issueCardAtomically(request);
  }
}