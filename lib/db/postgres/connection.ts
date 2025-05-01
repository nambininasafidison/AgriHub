import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "@/lib/env";

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: Number.parseInt(env.POSTGRES_PORT),
  database: env.POSTGRES_DATABASE,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export async function checkPostgresConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as now");
    client.release();
    console.log("PostgreSQL connected successfully:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("PostgreSQL connection check failed:", error);
    return false;
  }
}

export async function closePostgresConnection() {
  try {
    await pool.end();
    console.log("PostgreSQL connection pool closed");
    return true;
  } catch (error) {
    console.error("Error closing PostgreSQL connection pool:", error);
    return false;
  }
}
