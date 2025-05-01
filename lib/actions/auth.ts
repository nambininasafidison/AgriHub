"use server";

import { db } from "@/lib/db/postgres/connection";
import { passwordResets, users } from "@/lib/db/postgres/schema";
import {
  registrationFormSchema,
  userSchema,
  validateForm,
} from "@/lib/validationSchemas";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { signJwtToken, verifyJwtToken } from "../jwt";
import type { User } from "../types";

export async function createSession(user: User) {
  try {
    const { password, ...userWithoutPassword } = user;

    const token = await signJwtToken({ ...userWithoutPassword });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return userWithoutPassword;
  } catch (error) {
    console.error("Failed to create session:", error);
    return null;
  }
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session || !session.value) {
      return null;
    }

    const verified = await verifyJwtToken(session.value);
    return verified;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function refreshSession(): Promise<User | null> {
  try {
    const currentSession = await getSession();
    if (!currentSession) return null;

    return await createSession(currentSession as User);
  } catch (error) {
    console.error("Failed to refresh session:", error);
    return null;
  }
}

export async function login(formData: FormData) {
  try {
    const data = validateForm(userSchema, Object.fromEntries(formData));
    const { email, password } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        addresses: true,
      },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    const userObj = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "farmer" | "buyer" | "supplier",
      region: user.region,
      specialty: user.specialty,
      isVerified: user.isVerified,
      addresses: user.addresses.map((addr) => ({
        id: addr.uuid,
        name: addr.name,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        region: addr.region,
        postalCode: addr.postalCode,
        country: addr.country,
        isDefault: addr.isDefault,
        type: addr.type as "shipping" | "billing" | "both",
      })),
      preferences: user.preferences,
    };

    const session = await createSession(userObj as User);

    if (!session) {
      return { error: "Failed to create session" };
    }

    return { success: true, user: session };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login" };
  }
}

export async function register(formData: FormData) {
  try {
    const data = validateForm(
      registrationFormSchema,
      Object.fromEntries(formData)
    );
    const { name, email, password, confirmPassword, role, region, specialty } =
      data;

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      uuid: uuidv4(),
      name,
      email,
      passwordHash,
      role,
      region,
      specialty,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(users).values(newUser);

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
}

export async function requestPasswordReset(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return { error: "Email is required" };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: "No user found with this email" };
    }

    const resetToken = uuidv4();

    await db.insert(passwordResets).values({
      email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    });

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      body: `Click the link to reset your password: ${process.env.APP_URL}/auth/reset-password?token=${resetToken}&email=${email}`,
    });

    return {};
  } catch (error) {
    console.error("Password reset request error:", error);
    return { error: "An error occurred while processing the request" };
  }
}

export async function resetPassword(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !token || !password || !confirmPassword) {
      return { error: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const resetRequest = await db.query.passwordResets.findFirst({
      where: eq(passwordResets.token, token),
    });

    if (
      !resetRequest ||
      resetRequest.email !== email ||
      new Date(resetRequest.expiresAt) < new Date()
    ) {
      return { error: "Invalid or expired reset token" };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    await db.delete(passwordResets).where(eq(passwordResets.token, token));

    return {};
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "An error occurred while resetting the password" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}

export async function requireAuth() {
  const user = await getSession();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return user;
}

export async function verifyEmail(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;

    if (!email || !token) {
      return { error: "Email et token sont requis" };
    }

    const verificationRequest = await db.query.passwordResets.findFirst({
      where: eq(passwordResets.token, token),
    });

    if (
      !verificationRequest ||
      verificationRequest.email !== email ||
      new Date(verificationRequest.expiresAt) < new Date()
    ) {
      return { error: "Token de vérification invalide ou expiré" };
    }

    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.email, email));
    await db.delete(passwordResets).where(eq(passwordResets.token, token));

    return {};
  } catch (error) {
    console.error("Erreur de vérification de l'email:", error);
    return {
      error: "Une erreur est survenue lors de la vérification de l'email",
    };
  }
}

async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"AgriCommerceHub" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text: body,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}
