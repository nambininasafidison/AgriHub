import { db } from "@/lib/db/postgres/connection";
import { addresses, users, activities } from "@/lib/db/postgres/schema";
import bcrypt from "bcryptjs";
import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getUserById(id: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.uuid, id),
    with: {
      addresses: true,
    },
  });

  return result;
}

export async function getUserByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      addresses: true,
    },
  });

  return result;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
  region?: string;
  specialty?: string;
}) {
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(userData.password, salt);

  const uuid = uuidv4();

  const [newUser] = await db
    .insert(users)
    .values({
      uuid,
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role || "buyer",
      region: userData.region,
      specialty: userData.specialty,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (userData.region) {
    await db.insert(addresses).values({
      uuid: uuidv4(),
      userId: uuid,
      name: userData.name,
      phone: "",
      address: "",
      city: "",
      region: userData.region,
      country: "Madagascar",
      isDefault: true,
      type: "both",
    });
  }

  return newUser;
}

export async function updateUser(
  id: string,
  userData: {
    name?: string;
    email?: string;
    region?: string;
    specialty?: string;
    phone?: string;
    isVerified?: boolean;
    preferences?: any;
  }
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...userData,
      updatedAt: new Date(),
    })
    .where(eq(users.uuid, id))
    .returning();

  return updatedUser;
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  // Update password
  await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.uuid, id));

  return true;
}

export async function addUserAddress(
  userId: string,
  addressData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;
    isDefault?: boolean;
    type?: "shipping" | "billing" | "both";
  }
) {
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));
  }

  const [newAddress] = await db
    .insert(addresses)
    .values({
      uuid: uuidv4(),
      userId,
      name: addressData.name,
      phone: addressData.phone,
      address: addressData.address,
      city: addressData.city,
      region: addressData.region,
      postalCode: addressData.postalCode,
      country: addressData.country,
      isDefault: addressData.isDefault || false,
      type: addressData.type || "both",
    })
    .returning();

  return newAddress;
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  addressData: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
    type?: "shipping" | "billing" | "both";
  }
) {
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(and(eq(addresses.userId, userId), eq(addresses.uuid, addressId)));
  }

  const [updatedAddress] = await db
    .update(addresses)
    .set(addressData)
    .where(and(eq(addresses.userId, userId), eq(addresses.uuid, addressId)))
    .returning();

  return updatedAddress;
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const address = await db.query.addresses.findFirst({
    where: and(eq(addresses.userId, userId), eq(addresses.uuid, addressId)),
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (address.isDefault) {
    throw new Error("Cannot delete the default address");
  }

  await db
    .delete(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.uuid, addressId)));

  return true;
}

export async function getUserProfile(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.uuid, userId),
    with: {
      addresses: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    specialty: user.specialty,
    phone: user.phone,
    avatar: user.avatar,
    isVerified: user.isVerified,
    addresses: user.addresses,
    memberSince: user.createdAt,
  };
}

export async function getUserActivity(userId: string) {
  try {
    const activitiesData = await db.query.activities.findMany({
      where: eq(activities.userId, userId),
      orderBy: [desc(activities.timestamp)],
      limit: 10,
    });

    if (!activitiesData) {
      throw new Error("No activities found for the user");
    }

    return activitiesData.map((activity) => ({
      id: activity.id.toString(),
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
    }));
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw new Error("Failed to fetch user activities");
  }
}
