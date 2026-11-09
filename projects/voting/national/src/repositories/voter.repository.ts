import type { Pool } from "pg";

import type {
  CitizenId,
  KenyaCounty,
} from "../types/citizen.types.js";

import type {
  VoterCard,
  VoterCardId,
  VoterRegistrationRequest,
} from "../types/voter-card.types.js";

export interface VoterRepository {
  findByCitizenId(
    citizenId: CitizenId
  ): Promise<VoterCard | null>;

  findByCardId(
    voterCardId: VoterCardId
  ): Promise<VoterCard | null>;

  issueCardAtomically(
    request: VoterRegistrationRequest
  ): Promise<VoterCard>;
}

interface VoterCardRow {
  voter_card_id: string;
  citizen_id: string;
  registration_centre_id: string;
  county: string;
  status: VoterCard["status"];
  issued_at: Date | string | null;
  created_at: Date | string;
  verification_status: VoterCard["identityVerificationStatus"];
}

function mapVoterCard(row: VoterCardRow): VoterCard {
  return {
    voterCardId: row.voter_card_id as VoterCardId,
    citizenId: row.citizen_id as CitizenId,
    registrationCentreId: row.registration_centre_id,
    county: row.county as KenyaCounty,
    status: row.status,
    identityVerificationStatus: row.verification_status,
    issuedAt: row.issued_at
      ? new Date(row.issued_at).toISOString()
      : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class PostgresVoterRepository
  implements VoterRepository
{
  constructor(private readonly pool: Pool) {}

  async findByCitizenId(
    citizenId: CitizenId
  ): Promise<VoterCard | null> {
    const result = await this.pool.query<VoterCardRow>(
      `
      SELECT
        v.voter_card_id,
        v.citizen_id,
        v.registration_centre_id,
        v.county,
        v.status,
        v.issued_at,
        v.created_at,
        c.verification_status
      FROM voter_cards v
      INNER JOIN citizens c
        ON c.citizen_id = v.citizen_id
      WHERE v.citizen_id = $1
      `,
      [citizenId]
    );

    const row = result.rows[0];

    return row ? mapVoterCard(row) : null;
  }

  async findByCardId(
    voterCardId: VoterCardId
  ): Promise<VoterCard | null> {
    const result = await this.pool.query<VoterCardRow>(
      `
      SELECT
        v.voter_card_id,
        v.citizen_id,
        v.registration_centre_id,
        v.county,
        v.status,
        v.issued_at,
        v.created_at,
        c.verification_status
      FROM voter_cards v
      INNER JOIN citizens c
        ON c.citizen_id = v.citizen_id
      WHERE v.voter_card_id = $1
      `,
      [voterCardId]
    );

    const row = result.rows[0];

    return row ? mapVoterCard(row) : null;
  }

  async issueCardAtomically(
    request: VoterRegistrationRequest
  ): Promise<VoterCard> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // Serialize issuance attempts for this citizen.
      const citizenResult = await client.query<{
        citizen_id: string;
        verification_status: string;
      }>(
        `
        SELECT citizen_id, verification_status
        FROM citizens
        WHERE citizen_id = $1
        FOR UPDATE
        `,
        [request.citizenId]
      );

      const citizen = citizenResult.rows[0];

      if (!citizen) {
        throw new Error("Citizen does not exist.");
      }

      if (citizen.verification_status !== "VERIFIED") {
        throw new Error("Citizen is not verified.");
      }

      // Check again inside the transaction.
      const existing = await client.query(
        `
        SELECT voter_card_id
        FROM voter_cards
        WHERE citizen_id = $1
        `,
        [request.citizenId]
      );

      if (existing.rowCount && existing.rowCount > 0) {
        throw new Error(
          "A voter card already exists for this citizen."
        );
      }

      // The issuing service must already have verified
      // identity, relationships, and legal eligibility.
      const result = await client.query<VoterCardRow>(
        `
        INSERT INTO voter_cards (
          voter_card_id,
          citizen_id,
          registration_centre_id,
          county,
          status,
          issued_at,
          created_at
        )
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          'ACTIVE',
          NOW(),
          NOW()
        )
        RETURNING
          voter_card_id,
          citizen_id,
          registration_centre_id,
          county,
          status,
          issued_at,
          created_at,
          'VERIFIED'::TEXT AS verification_status
        `,
        [
          request.citizenId,
          request.registrationCentreId,
          request.county,
        ]
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error("Voter card issuance failed.");
      }

      await client.query("COMMIT");

      return mapVoterCard(row);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}