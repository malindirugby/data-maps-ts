import type { Pool } from "pg";

export type AuditOutcome =
  | "SUCCESS"
  | "FAILURE"
  | "DENIED";

export interface AuditEvent {
  readonly eventType: string;
  readonly actorId: string;
  readonly subjectId?: string;
  readonly outcome: AuditOutcome;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface AuditLogger {
  write(event: AuditEvent): Promise<void>;
}

const MAX_METADATA_LENGTH = 8_000;

const SENSITIVE_KEY =
  /password|secret|token|private.?key|national.?id|identity.?number|credential|ballot|vote.?choice/i;

function sanitizeValue(
  value: unknown,
  depth = 0
): unknown {
  if (depth > 5) {
    return "[MAX_DEPTH]";
  }

  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return value;
  }

  if (typeof value === "string") {
    return value.slice(0, 500);
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(
      value as Record<string, unknown>
    )) {
      if (SENSITIVE_KEY.test(key)) {
        result[key] = "[REDACTED]";
        continue;
      }

      result[key] = sanitizeValue(item, depth + 1);
    }

    return result;
  }

  return "[UNSUPPORTED_VALUE]";
}

export class PostgresAuditLogger implements AuditLogger {
  constructor(private readonly pool: Pool) {}

  async write(event: AuditEvent): Promise<void> {
    if (!event.actorId.trim()) {
      throw new Error("Audit events require an actor ID.");
    }

    if (!event.eventType.trim()) {
      throw new Error("Audit events require an event type.");
    }

    const metadata = sanitizeValue(event.metadata);

    const metadataJson = JSON.stringify(metadata);

    if (metadataJson.length > MAX_METADATA_LENGTH) {
      throw new Error("Audit metadata exceeds the allowed size.");
    }

    await this.pool.query(
      `
      INSERT INTO audit_events (
        event_id,
        event_type,
        actor_id,
        subject_id,
        outcome,
        metadata,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5::JSONB,
        NOW()
      )
      `,
      [
        event.eventType,
        event.actorId,
        event.subjectId ?? null,
        event.outcome,
        metadataJson,
      ]
    );
  }
}