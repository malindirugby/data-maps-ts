import "dotenv/config";

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : undefined,
});

pool.on("error", (error) => {
  // Do not log connection credentials or sensitive record contents.
  console.error("Unexpected PostgreSQL pool error:", error.message);
});