import type {
  CitizenId,
} from "../types/citizen.types.js";

import type {
  Election,
  VotingAuthorization,
} from "../types/election.types.js";

import type {
  ElectionId,
  VoterCardId,
} from "../types/voter-card.types.js";

import type {
  VoterRepository,
} from "../repositories/voter.repository.js";

import type {
  AuditLogger,
} from "../security/audit-log.js";

export interface ElectionRepository {
  findById(id: ElectionId): Promise<Election | null>;

  findAll(): Promise<readonly Election[]>;

  hasVoted(
    electionId: ElectionId,
    citizenId: CitizenId
  ): Promise<boolean>;
}

export interface ElectionAuthorizationRepository {
  createAuthorization(
    authorization: VotingAuthorization
  ): Promise<void>;

  findAuthorization(
    electionId: ElectionId,
    citizenId: CitizenId
  ): Promise<VotingAuthorization | null>;
}

export interface ElectionEligibilityService {
  isEligibleForElection(
    election: Election,
    citizenId: CitizenId
  ): Promise<boolean>;
}

export class ElectionService {
  constructor(
    private readonly elections: ElectionRepository,
    private readonly voters: VoterRepository,
    private readonly authorizations: ElectionAuthorizationRepository,
    private readonly eligibility: ElectionEligibilityService,
    private readonly audit: AuditLogger
  ) {}

  async getElection(
    electionId: ElectionId
  ): Promise<Election> {
    const election = await this.elections.findById(electionId);

    if (!election) {
      throw new Error("Election not found.");
    }

    return election;
  }

  async listElections(): Promise<readonly Election[]> {
    return this.elections.findAll();
  }

  async authorizeVoter(
    electionId: ElectionId,
    voterCardId: VoterCardId,
    actorId: string
  ): Promise<VotingAuthorization> {
    if (!actorId.trim()) {
      throw new Error("An authenticated actor is required.");
    }

    const election = await this.getElection(electionId);

    if (election.status !== "OPEN") {
      throw new Error("This election is not open.");
    }

    const now = Date.now();
    const opensAt = Date.parse(election.opensAt);
    const closesAt = Date.parse(election.closesAt);

    if (
      !Number.isFinite(opensAt) ||
      !Number.isFinite(closesAt) ||
      closesAt <= opensAt
    ) {
      throw new Error("Election schedule is invalid.");
    }

    if (now < opensAt || now >= closesAt) {
      throw new Error("Voting is outside the permitted time window.");
    }

    const voterCard = await this.voters.findByCardId(
      voterCardId
    );

    if (!voterCard) {
      throw new Error("Voter card not found.");
    }

    if (voterCard.status !== "ACTIVE") {
      throw new Error("Voter card is not active.");
    }

    if (voterCard.identityVerificationStatus !== "VERIFIED") {
      throw new Error("Voter identity is not verified.");
    }

    const alreadyAuthorized =
      await this.authorizations.findAuthorization(
        electionId,
        voterCard.citizenId
      );

    if (alreadyAuthorized) {
      throw new Error(
        "An authorization record already exists for this voter."
      );
    }

    const alreadyVoted = await this.elections.hasVoted(
      electionId,
      voterCard.citizenId
    );

    if (alreadyVoted) {
      throw new Error("This voter has already voted.");
    }

    const eligible =
      await this.eligibility.isEligibleForElection(
        election,
        voterCard.citizenId
      );

    if (!eligible) {
      throw new Error(
        "The citizen is not eligible for this election."
      );
    }

    const authorization: VotingAuthorization = {
      authorizationId: crypto.randomUUID(),
      electionId,
      voterCardId,
      citizenId: voterCard.citizenId,
      authorized: true,
      checkedAt: new Date().toISOString(),
    };

    await this.authorizations.createAuthorization(
      authorization
    );

    await this.audit.write({
      eventType: "VOTER_AUTHORIZED",
      actorId,
      subjectId: voterCard.citizenId,
      outcome: "SUCCESS",
      metadata: {
        electionId,
        voterCardId,
      },
    });

    return authorization;
  }
}