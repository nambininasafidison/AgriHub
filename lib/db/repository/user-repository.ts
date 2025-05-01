import { db } from "@/lib/db/postgres/connection"
import { users, addresses } from "@/lib/db/postgres/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import type { User, Address } from "@/lib/types"

export async function getUserById(id: string) {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.uuid, id),
      with: {
        addresses: true,
      },
    })

    return result
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        addresses: true,
      },
    })

    return result
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function createUser(userData: Omit<User, "id">) {
  try {
    const uuid = uuidv4()

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(userData.password || "", salt)

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
        phone: userData.phone,
        avatar: userData.avatar,
        isVerified: userData.isVerified || false,
        preferences: userData.preferences,
      })
      .returning()

    // Create addresses if provided
    if (userData.addresses && userData.addresses.length > 0) {
      for (const addressData of userData.addresses) {
        await db.insert(addresses).values({
          uuid: uuidv4(),
          userId: uuid,
          name: addressData.name,
          phone: addressData.phone || "",
          address: addressData.address,
          city: addressData.city,
          region: addressData.region,
          postalCode: addressData.postalCode,
          country: addressData.country,
          isDefault: addressData.isDefault,
          type: addressData.type,
        })
      }
    }

    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  try {
    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        region: userData.region,
        specialty: userData.specialty,
        phone: userData.phone,
        avatar: userData.avatar,
        isVerified: userData.isVerified,
        preferences: userData.preferences,
        updatedAt: new Date(),
      })
      .where(eq(users.uuid, id))
      .returning()

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function addUserAddress(userId: string, addressData: Omit<Address, "id">) {
  try {
    const [newAddress] = await db
      .insert(addresses)
      .values({
        uuid: uuidv4(),
        userId,
        name: addressData.name,
        phone: addressData.phone || "",
        address: addressData.address,
        city: addressData.city,
        region: addressData.region,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: addressData.isDefault,
        type: addressData.type,
      })
      .returning()

    // If this is the default address, update other addresses
    if (addressData.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId) && eq(addresses.uuid, newAddress.uuid))
    }

    return newAddress
  } catch (error) {
    console.error("Error adding user address:", error)
    throw error
  }
}

export async function updateUserAddress(id: string, addressData: Partial<Address>) {
  try {
    const [updatedAddress] = await db
      .update(addresses)
      .set({
        name: addressData.name,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        region: addressData.region,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: addressData.isDefault,
        type: addressData.type,
        updatedAt: new Date(),
      })
      .where(eq(addresses.uuid, id))
      .returning()

    // If this is the default address, update other addresses
    if (addressData.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, updatedAddress.userId) && eq(addresses.uuid, updatedAddress.uuid))
    }

    return updatedAddress
  } catch (error) {
    console.error("Error updating user address:", error)
    throw error
  }
}

export async function deleteUserAddress(id: string) {
  try {
    const [deletedAddress] = await db.delete(addresses).where(eq(addresses.uuid, id)).returning()

    return deletedAddress
  } catch (error) {
    console.error("Error deleting user address:", error)
    throw error
  }
}

export async function verifyUserPassword(userId: string, password: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.uuid, userId),
    })

    if (!user) {
      return false
    }

    return bcrypt.compare(password, user.passwordHash)
  } catch (error) {
    console.error("Error verifying user password:", error)
    throw error
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    // Update user password
    const [updatedUser] = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.uuid, userId))
      .returning()

    return updatedUser
  } catch (error) {
    console.error("Error updating user password:", error)
    throw error
  }
}
