import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  minPurchase: integer("min_purchase"),
  maxDiscount: integer("max_discount"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
});
