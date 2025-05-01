import { jwtVerify, SignJWT } from "jose";
import { Session, User } from "./types";
import { nanoid } from "nanoid";

export async function verifyJwtToken(token: string): Promise<Session> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.id === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      typeof payload.role === "string" &&
      typeof payload.iat === "number" &&
      typeof payload.exp === "number"
    ) {
      return {
        id: payload.id as string,
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as "admin" | "farmer" | "buyer" | "supplier",
        region: payload.region as string,
        specialty: payload.specialty as string,
        isVerified: payload.isVerified as boolean,
        addresses: payload.addresses as User["addresses"],
        preferences: payload.preferences as User["preferences"],
        iat: payload.iat as number,
        exp: payload.exp as number,
      };
    } else {
      throw new Error("Invalid token payload structure");
    }
  } catch (error) {
    throw new Error("Your token has expired or is invalid");
  }
}

export async function signJwtToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}
