import { type NextRequest, NextResponse } from "next/server"
import { migrateData } from "@/lib/db/migrate-data"

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with admin token
    if (process.env.NODE_ENV !== "development") {
      const adminToken = request.headers.get("x-admin-token")

      if (adminToken !== process.env.ADMIN_BYPASS_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    await migrateData()

    return NextResponse.json({ success: true, message: "Data migration completed successfully" })
  } catch (error) {
    console.error("Error migrating data:", error)
    return NextResponse.json({ error: "Failed to migrate data" }, { status: 500 })
  }
}
