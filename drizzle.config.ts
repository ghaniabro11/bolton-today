import type { Config } from "drizzle-kit";

// Parse connection string
const DB_URL = new URL(process.env.DATABASE_URL || "");

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: DB_URL.hostname,
    user: DB_URL.username,
    password: DB_URL.password,
    database: DB_URL.pathname.slice(1), // Remove leading '/'
    ssl: {
      rejectUnauthorized: false // This will allow self-signed certificates
    },
  },
  verbose: true,
  strict: true,
} satisfies Config;