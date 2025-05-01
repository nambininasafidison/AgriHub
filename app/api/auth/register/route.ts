import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres/connection"
import { users } from "@/lib/db/postgres/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, body.email)).limit(1)

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, salt)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        uuid: uuidv4(),
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role || "buyer",
        region: body.region,
        specialty: body.specialty,
        phone: body.phone,
        avatar: body.avatar,
        isVerified: false,
        preferences: body.preferences || {},
      })
      .returning({
        id: users.id,
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        role: users.role,
        region: users.region,
        specialty: users.specialty,
        phone: users.phone,
        avatar: users.avatar,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
      })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
