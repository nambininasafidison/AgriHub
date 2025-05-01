import { pgTable, serial, varchar, text, decimal, timestamp, boolean, json, integer } from "drizzle-orm/pg-core"

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  code: varchar("code", { length: 50 }).unique(),
  minimumOrderAmount: decimal("minimum_order_amount", { precision: 10, scale: 2 }),
  maximumDiscount: decimal("maximum_discount", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  applicableCategories: json("applicable_categories").$type<string[]>(),
  applicableProducts: json("applicable_products").$type<string[]>(),
  excludedCategories: json("excluded_categories").$type<string[]>(),
  excludedProducts: json("excluded_products").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
