import type { CitizenId, KenyaCounty, VerificationStatus, } from "./citizen.types.ts";

export type VoterCardId = string & {
  readonly __brand: "VoterCardId";
};

export type ElectionId = string & {
  readonly __brand: "ElectionId";
};

export interface VoterCard {
  readonly voterCardId: VoterCardId;

  // Parent relationship: every card belongs to a citizen.
  readonly citizenId: CitizenId;

  readonly registrationCentreId: string;
  readonly county: KenyaCounty;

  readonly status: | "PENDING" | "ACTIVE" | "SUSPENDED" | "REVOKED";

  readonly identityVerificationStatus: VerificationStatus;

  readonly issuedAt: string | null;
  readonly createdAt: string;
}

export interface VoterRegistrationRequest {
  readonly citizenId: CitizenId;
  readonly registrationCentreId: string;
  readonly county: KenyaCounty;
}

export interface VoterEligibilityResult {
  readonly eligible: boolean;
  readonly reasons: readonly string[];
}