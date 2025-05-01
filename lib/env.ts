// Environment variables type definitions
type Env = {
  NODE_ENV: string;

  NEXT_PUBLIC_APP_URL: string;
  JWT_SECRET: string;
  ADMIN_BYPASS_TOKEN: string;

  // MongoDB configuration
  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_INITDB_DATABASE: string;
  MONGODB_URI: string;

  // PostgreSQL configuration
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_DATABASE: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;

  NEXT_PUBLIC_API_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  TEST_URL: string;
  MAINTENANCE_MODE: string;
  NEXT_PUBLIC_APP_VERSION: string;
};

// Get environment variables with type safety
function getEnv(): Env {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    ADMIN_BYPASS_TOKEN: process.env.ADMIN_BYPASS_TOKEN || "admin-bypass-token",

    // MongoDB configuration
    MONGO_INITDB_ROOT_USERNAME:
      process.env.MONGO_INITDB_ROOT_USERNAME || "admin",
    MONGO_INITDB_ROOT_PASSWORD:
      process.env.MONGO_INITDB_ROOT_PASSWORD || "password",
    MONGO_INITDB_DATABASE:
      process.env.MONGO_INITDB_DATABASE || "agricom",
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://localhost:27017/agricom",

    // PostgreSQL configuration
    POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
    POSTGRES_PORT: process.env.POSTGRES_PORT || "5432",
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || "agricom",
    POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",

    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    TEST_URL: process.env.TEST_URL || "http://localhost:3000",
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE || "false",
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  };
}

// Export environment variables
export const env = getEnv();

// Validate required environment variables
export function validateEnv() {
  const requiredEnvVars = [
    "JWT_SECRET",
    "MONGODB_URI",
    "POSTGRES_HOST",
    "POSTGRES_DATABASE",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}
