import type { Pool, PoolClient } from "pg";

import type {
  Citizen,
  CitizenId,
  CitizenRelationship,
  KenyaCounty,
  VerificationStatus,
} from "../types/citizen.types.js";

export interface NewCitizenRecord {
  readonly citizen: Citizen;
}

export interface CitizenRepository {
  findById(id: CitizenId): Promise<Citizen | null>;

  findByIdentityReference(
    reference: string
  ): Promise<Citizen | null>;

  create(record: NewCitizenRecord): Promise<Citizen>;

  updateVerificationStatus(
    id: CitizenId,
    status: VerificationStatus
  ): Promise<Citizen | null>;
}

interface CitizenRow {
  citizen_id: string;
  identity_reference: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  verification_status: VerificationStatus;
  county: string | null;
  constituency: string | null;
  ward: string | null;
  registration_centre_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface RelationshipRow {
  relationship_id: string;
  subject_citizen_id: string;
  related_citizen_id: string | null;
  relationship_type:
    | "PARENT"
    | "GUARDIAN"
    | "ALTERNATIVE_VERIFICATION";
  verification_reference: string;
  verification_status: VerificationStatus;
  case_reference?: string | null;
  approving_officer_id?: string | null;
}

function toIsoString(value: Date | string): string {
  return new Date(value).toISOString();
}

function mapCitizen(
  row: CitizenRow,
  relationships: CitizenRelationship[]
): Citizen {
  if (
    !row.county ||
    !row.constituency ||
    !row.ward ||
    !row.registration_centre_id
  ) {
    throw new Error(
      `Citizen ${row.citizen_id} has incomplete address information.`
    );
  }

  return {
    identity: {
      citizenId: row.citizen_id as CitizenId,
      fullName: row.full_name,
      dateOfBirth: row.date_of_birth,
      nationality: "KE",
      identityReference: row.identity_reference as Citizen["identity"]["identityReference"],
    },
    address: {
      county: row.county as KenyaCounty,
      constituency: row.constituency,
      ward: row.ward,
      registrationCentreId: row.registration_centre_id,
    },
    relationships,
    verificationStatus: row.verification_status,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export class PostgresCitizenRepository
  implements CitizenRepository
{
  constructor(private readonly pool: Pool) {}

  private async loadRelationships(
    citizenId: string,
    executor: Pool | PoolClient
  ): Promise<CitizenRelationship[]> {
    const result = await executor.query<RelationshipRow>(
      `
      SELECT
        relationship_id,
        subject_citizen_id,
        related_citizen_id,
        relationship_type,
        verification_reference,
        verification_status,
        case_reference,
        approving_officer_id
      FROM citizen_relationships
      WHERE subject_citizen_id = $1
      ORDER BY relationship_id
      `,
      [citizenId]
    );

    return result.rows
      .filter((row) => row.verification_status === "VERIFIED")
      .map((row) => {
        if (row.relationship_type === "PARENT") {
          if (!row.related_citizen_id) {
            throw new Error("Parent relationship has no related citizen.");
          }

          return {
            type: "PARENT" as const,
            parentCitizenId: row.related_citizen_id as CitizenId,
            relationshipVerificationId: row.verification_reference,
          };
        }

        if (row.relationship_type === "GUARDIAN") {
          if (!row.related_citizen_id) {
            throw new Error("Guardian relationship has no related citizen.");
          }

          return {
            type: "GUARDIAN" as const,
            guardianCitizenId: row.related_citizen_id as CitizenId,
            relationshipVerificationId: row.verification_reference,
          };
        }

        return {
          type: "ALTERNATIVE_VERIFICATION" as const,
          caseReference: row.case_reference ?? "",
          approvingOfficerId: row.approving_officer_id ?? "",
        };
      });
  }

  async findById(
    id: CitizenId
  ): Promise<Citizen | null> {
    const result = await this.pool.query<CitizenRow>(
      `
      SELECT
        c.citizen_id,
        c.identity_reference,
        c.full_name,
        c.date_of_birth,
        c.nationality,
        c.verification_status,
        a.county,
        a.constituency,
        a.ward,
        a.registration_centre_id,
        c.created_at,
        c.updated_at
      FROM citizens c
      LEFT JOIN citizen_addresses a
        ON a.citizen_id = c.citizen_id
      WHERE c.citizen_id = $1
      `,
      [id]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const relationships = await this.loadRelationships(
      row.citizen_id,
      this.pool
    );

    return mapCitizen(row, relationships);
  }

  async findByIdentityReference(
    reference: string
  ): Promise<Citizen | null> {
    const result = await this.pool.query<CitizenRow>(
      `
      SELECT
        c.citizen_id,
        c.identity_reference,
        c.full_name,
        c.date_of_birth,
        c.nationality,
        c.verification_status,
        a.county,
        a.constituency,
        a.ward,
        a.registration_centre_id,
        c.created_at,
        c.updated_at
      FROM citizens c
      LEFT JOIN citizen_addresses a
        ON a.citizen_id = c.citizen_id
      WHERE c.identity_reference = $1
      `,
      [reference]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const relationships = await this.loadRelationships(
      row.citizen_id,
      this.pool
    );

    return mapCitizen(row, relationships);
  }

  async create(
    record: NewCitizenRecord
  ): Promise<Citizen> {
    const citizen = record.citizen;
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query<CitizenRow>(
        `
        INSERT INTO citizens (
          citizen_id,
          identity_reference,
          full_name,
          date_of_birth,
          nationality,
          verification_status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING
          citizen_id,
          identity_reference,
          full_name,
          date_of_birth,
          nationality,
          verification_status,
          created_at,
          updated_at,
          NULL::TEXT AS county,
          NULL::TEXT AS constituency,
          NULL::TEXT AS ward,
          NULL::TEXT AS registration_centre_id
        `,
        [
          citizen.identity.citizenId,
          citizen.identity.identityReference,
          citizen.identity.fullName,
          citizen.identity.dateOfBirth,
          citizen.identity.nationality,
          "PENDING",
        ]
      );

      const row = result.rows[0]!;

      await client.query(
        `
        INSERT INTO citizen_addresses (
          citizen_id,
          county,
          constituency,
          ward,
          registration_centre_id
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          citizen.identity.citizenId,
          citizen.address.county,
          citizen.address.constituency,
          citizen.address.ward,
          citizen.address.registrationCentreId,
        ]
      );

      for (const relationship of citizen.relationships) {
        if (relationship.type === "ALTERNATIVE_VERIFICATION") {
          await client.query(
            `
            INSERT INTO citizen_relationships (
              relationship_id,
              subject_citizen_id,
              related_citizen_id,
              relationship_type,
              verification_reference,
              verification_status,
              case_reference,
              approving_officer_id
            )
            VALUES (
              gen_random_uuid(),
              $1,
              NULL,
              'ALTERNATIVE_VERIFICATION',
              $2,
              'PENDING',
              $3,
              $4
            )
            `,
            [
              citizen.identity.citizenId,
              `alternative:${relationship.caseReference}`,
              relationship.caseReference,
              relationship.approvingOfficerId,
            ]
          );

          continue;
        }

        const relatedCitizenId =
          relationship.type === "PARENT"
            ? relationship.parentCitizenId
            : relationship.guardianCitizenId;

        await client.query(
          `
          INSERT INTO citizen_relationships (
            relationship_id,
            subject_citizen_id,
            related_citizen_id,
            relationship_type,
            verification_reference,
            verification_status
          )
          VALUES (
            gen_random_uuid(),
            $1,
            $2,
            $3,
            $4,
            'PENDING'
          )
          `,
          [
            citizen.identity.citizenId,
            relatedCitizenId,
            relationship.type,
            relationship.relationshipVerificationId,
          ]
        );
      }

      await client.query("COMMIT");

      // The inserted citizen remains PENDING. Never accept a
      // caller-supplied VERIFIED status during creation.
      return {
        identity: {
            citizenId: row.citizen_id as CitizenId,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            nationality: "KE",
            identityReference:
            row.identity_reference as Citizen["identity"]["identityReference"],
        },
        address: citizen.address,
        relationships: [],
        verificationStatus: "PENDING",
        createdAt: toIsoString(row.created_at),
        updatedAt: toIsoString(row.updated_at),
        };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateVerificationStatus(
    id: CitizenId,
    status: VerificationStatus
  ): Promise<Citizen | null> {
    const result = await this.pool.query(
      `
      UPDATE citizens
      SET
        verification_status = $2,
        updated_at = NOW()
      WHERE citizen_id = $1
      RETURNING citizen_id
      `,
      [id, status]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.findById(id);
  }
}