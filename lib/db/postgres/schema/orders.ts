import { pgTable, serial, varchar, text, decimal, timestamp, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./users"
import { orderItems } from "./order-items"

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  customer: varchar("customer", { length: 255 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  carrier: varchar("carrier", { length: 100 }),
  appliedPromotions:
    jsonb("applied_promotions").$type<
      Array<{
        id: string
        name: string
        type: string
        value: number
        discountAmount: number
      }>
    >(),
  currency: varchar("currency", { length: 10 }).notNull().default("MGA"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.uuid],
  }),
  items: many(orderItems),
}))
