import { pgTable, serial, varchar, text, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./users"

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  type: varchar("type", { length: 20 }).notNull().default("both"),
})

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.uuid],
  }),
}))
