import type {
  Citizen,
  CitizenId,
} from "../types/citizen.types.js";

export interface IdentityVerificationResult {
  readonly verified: boolean;
  readonly identityReference: string;
  readonly reason?: string;
}

export interface TrustedIdentityProvider {
  verifyCitizen(
    citizenId: CitizenId,
    identityReference: string
  ): Promise<IdentityVerificationResult>;
}

export class IdentityService {
  constructor(
    private readonly identityProvider: TrustedIdentityProvider
  ) {}

  async verifyCitizenIdentity(
    citizen: Citizen
  ): Promise<IdentityVerificationResult> {
    if (!citizen.identity.citizenId) {
      return {
        verified: false,
        identityReference: "",
        reason: "Missing citizen ID.",
      };
    }

    if (!citizen.identity.identityReference) {
      return {
        verified: false,
        identityReference: "",
        reason: "Missing identity reference.",
      };
    }

    const result = await this.identityProvider.verifyCitizen(
      citizen.identity.citizenId,
      citizen.identity.identityReference
    );

    if (!result.verified) {
      return {
        ...result,
        verified: false,
        reason: result.reason ?? "Identity verification failed.",
      };
    }

    return result;
  }
}