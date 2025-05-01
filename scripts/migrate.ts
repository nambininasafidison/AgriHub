import moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({
  "@": path.resolve(__dirname, "../"),
});

import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Pool } from "pg";

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: Number.parseInt(env.POSTGRES_PORT),
  database: env.POSTGRES_DATABASE,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool);

async function main() {
  console.log("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "lib/db/postgres/migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
