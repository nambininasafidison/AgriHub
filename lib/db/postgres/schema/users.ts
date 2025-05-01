import { pgTable, serial, varchar, text, timestamp, boolean, json } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { addresses } from "./addresses"
import { orders } from "./orders"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("buyer"),
  region: varchar("region", { length: 100 }),
  specialty: varchar("specialty", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").notNull().default(false),
  preferences: json("preferences").$type<{
    language: string
    currency: string
    newsletter: boolean
    marketingEmails: boolean
    orderUpdates: boolean
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
}))
