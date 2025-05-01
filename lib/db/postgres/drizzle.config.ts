import type { Config } from "drizzle-kit"
import { env } from "@/lib/env"

export default {
  schema: "./lib/db/postgres/schema.ts",
  out: "./lib/db/postgres/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: Number.parseInt(env.POSTGRES_PORT),
    database: env.POSTGRES_DATABASE,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
  verbose: true,
  strict: true,
} satisfies Config
