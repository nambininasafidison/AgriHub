import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const shippingMethods = pgTable("shipping_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  estimatedDeliveryTime: text("estimated_delivery_time").notNull(),
  isActive: boolean("is_active").default(true),
});
