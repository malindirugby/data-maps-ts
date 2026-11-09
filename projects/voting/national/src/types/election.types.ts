import type { CitizenId, } from "./citizen.types.ts";

import type { ElectionId, VoterCardId, } from "./voter-card.types.ts";

export interface Election {
  readonly electionId: ElectionId;
  readonly name: string;  
  readonly opensAt: string;
  readonly closesAt: string;
  readonly status: | "DRAFT" | "SCHEDULED" | "OPEN" | "CLOSED" | "CERTIFIED";
}

export interface VotingAuthorization {
  readonly authorizationId: string;
  readonly electionId: ElectionId;
  readonly voterCardId: VoterCardId;
  readonly citizenId: CitizenId;
  readonly authorized: boolean;
  readonly checkedAt: string;
}