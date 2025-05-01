import { connectToDatabases } from "@/lib/db";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connections
    const { mongo, postgres } = await connectToDatabases();

    // Check environment variables
    const envVars = {
      appUrl: !!env.NEXT_PUBLIC_APP_URL,
      jwtSecret: !!env.JWT_SECRET,
      mongoUri: !!env.MONGODB_URI,
      postgresHost: !!env.POSTGRES_HOST,
      postgresDatabase: !!env.POSTGRES_DATABASE,
    };

    // Overall status
    const isHealthy =
      mongo && postgres && Object.values(envVars).every(Boolean);

    // App version
    const appVersion = env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

    // Maintenance mode
    const maintenanceMode = env.MAINTENANCE_MODE === "true";

    return NextResponse.json({
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      version: appVersion,
      environment: process.env.NODE_ENV,
      maintenance: maintenanceMode,
      databases: {
        mongodb: mongo ? "connected" : "disconnected",
        postgres: postgres ? "connected" : "disconnected",
      },
      config: envVars,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}
