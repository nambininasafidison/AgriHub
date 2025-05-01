import { getSession } from "@/lib/actions/auth";
import { connectToDatabases } from "@/lib/db";
import ActivityLog from "@/lib/db/mongo/models/activity-log.model";
import type { NextRequest } from "next/server";

export async function activityLogger(
  req: NextRequest,
  action: string,
  target?: string,
  targetId?: string,
  metadata?: Record<string, any>
) {
  try {
    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("MongoDB connection is not available");
      return false;
    }

    const session = await getSession();

    const sessionId = req.cookies.get("cartSessionId")?.value;

    await ActivityLog.create({
      userId: session?.id,
      sessionId,
      action,
      target,
      targetId,
      metadata,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent"),
      timestamp: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return false;
  }
}

export async function logRequestResponse(req: NextRequest, res: Response) {
  console.log("Request:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  console.log("Response:", {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
  });
}
