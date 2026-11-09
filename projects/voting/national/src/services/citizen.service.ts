import type {
  Citizen,
  CitizenId,
} from "../types/citizen.types.js";

import type {
  CitizenRepository,
} from "../repositories/citizen.repository.js";

import type {
  IdentityService,
} from "./identity.service.js";

import type {
  AuditLogger,
} from "../security/audit-log.js";

export interface CreateCitizenInput {
  readonly citizen: Citizen;
}

export interface CitizenVerificationWorkflow {
  requestVerification(
    citizenId: CitizenId,
    requestedBy: string
  ): Promise<void>;
}

export class CitizenService {
  constructor(
    private readonly citizens: CitizenRepository,
    private readonly identity: IdentityService,
    private readonly verificationWorkflow: CitizenVerificationWorkflow,
    private readonly audit: AuditLogger
  ) {}

  async getCitizen(
    citizenId: CitizenId
  ): Promise<Citizen> {
    const citizen = await this.citizens.findById(citizenId);

    if (!citizen) {
      throw new Error("Citizen not found.");
    }

    return citizen;
  }

  async registerCitizen(
    input: CreateCitizenInput,
    actorId: string
  ): Promise<Citizen> {
    if (!actorId.trim()) {
      throw new Error("An authenticated actor is required.");
    }

    const existing =
      await this.citizens.findByIdentityReference(
        input.citizen.identity.identityReference
      );

    if (existing) {
      throw new Error(
        "A citizen with this identity reference already exists."
      );
    }

    // Repository creation must force PENDING status.
    const pendingCitizen = await this.citizens.create(input);

    await this.audit.write({
      eventType: "CITIZEN_CREATED",
      actorId,
      subjectId: pendingCitizen.identity.citizenId,
      outcome: "SUCCESS",
      metadata: {
        verificationStatus: "PENDING",
      },
    });

    return pendingCitizen;
  }

  async requestCitizenVerification(
    citizenId: CitizenId,
    actorId: string
  ): Promise<void> {
    if (!actorId.trim()) {
      throw new Error("An authenticated actor is required.");
    }

    const citizen = await this.getCitizen(citizenId);

    if (citizen.verificationStatus === "VERIFIED") {
      throw new Error("Citizen is already verified.");
    }

    // Request verification through the trusted workflow.
    await this.verificationWorkflow.requestVerification(
      citizenId,
      actorId
    );

    await this.audit.write({
      eventType: "IDENTITY_VERIFICATION_REQUESTED",
      actorId,
      subjectId: citizenId,
      outcome: "SUCCESS",
      metadata: {},
    });
  }

  async verifyIdentityWithProvider(
    citizenId: CitizenId,
    authorizedVerifierId: string
  ): Promise<void> {
    if (!authorizedVerifierId.trim()) {
      throw new Error("Verifier identity is required.");
    }

    const citizen = await this.getCitizen(citizenId);

    const result =
      await this.identity.verifyCitizenIdentity(citizen);

    await this.audit.write({
      eventType: "IDENTITY_VERIFICATION_ATTEMPTED",
      actorId: authorizedVerifierId,
      subjectId: citizenId,
      outcome: result.verified ? "SUCCESS" : "FAILURE",
      metadata: {
        reason: result.reason ?? null,
      },
    });

    if (!result.verified) {
      throw new Error(
        result.reason ?? "Identity verification failed."
      );
    }

    // Do not mark the citizen VERIFIED here automatically.
    // An authorized verification workflow must persist
    // the provider's result and apply the required approvals.
  }
}