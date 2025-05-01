import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  json,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("buyer"),
  region: varchar("region", { length: 100 }),
  specialty: varchar("specialty", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").default(false),
  preferences: json("preferences").$type<{
    language?: string;
    currency?: string;
    newsletter?: boolean;
    marketingEmails?: boolean;
    orderUpdates?: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  products: many(products),
  orders: many(orders),
  reviews: many(productReviews),
}));

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull().default("Madagascar"),
  isDefault: boolean("is_default").default(false),
  type: varchar("type", { length: 20 }).notNull().default("shipping"), // shipping, billing, both
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.uuid],
  }),
}));

export const products = pgTable("products", {
  uuid: varchar("uuid", { length: 36 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  salePrice: numeric("sale_price"),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  region: varchar("region", { length: 100 }),
  seller: varchar("seller", { length: 255 }),
  sellerId: varchar("seller_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating"),
  reviewCount: integer("review_count").default(0),
  image: text("image"),
  images: json("images").$type<string[]>(),
  varieties: json("varieties").$type<string[]>(),
  attributes: json("attributes").$type<Record<string, string>>(),
  weight: numeric("weight"),
  dimensions: varchar("dimensions", { length: 100 }),
  sku: varchar("sku", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  onSale: boolean("on_sale").default(false),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.uuid],
  }),
  reviews: many(productReviews),
  variations: many(productVariations),
  orderItems: many(orderItems),
}));

export const productVariations = pgTable("product_variations", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.uuid),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price"),
  stock: integer("stock").default(0),
  image: text("image"),
  attributes: json("attributes").$type<Record<string, string>>(),
  sku: varchar("sku", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productVariationsRelations = relations(
  productVariations,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariations.productId],
      references: [products.uuid],
    }),
  })
);

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.uuid),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  title: varchar("title", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.uuid],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.uuid],
  }),
}));

export const orders = pgTable("orders", {
  uuid: varchar("uuid", { length: 36 }).primaryKey().notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  customer: varchar("customer", { length: 255 }).notNull(),
  subtotal: numeric("subtotal").notNull(),
  shippingCost: numeric("shipping_cost").notNull(),
  taxAmount: numeric("tax_amount").notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paymentStatus: varchar("payment_status", { length: 50 })
    .notNull()
    .default("pending"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  shippingAddress: text("shipping_address"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  carrier: varchar("carrier", { length: 100 }),
  appliedPromotions: json("applied_promotions").$type<string[]>(),
  currency: varchar("currency", { length: 10 }).default("MGA"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.uuid],
  }),
  items: many(orderItems),
}));

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  orderUuid: varchar("order_uuid", { length: 36 }).notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  productUuid: varchar("product_uuid", { length: 36 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image").notNull(),
  variety: varchar("variety", { length: 100 }),
  variationId: varchar("variation_id", { length: 36 }),
  variationName: varchar("variation_name", { length: 255 }),
  weight: numeric("weight").notNull(),
  subtotal: numeric("subtotal").notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  value: numeric("value").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  minOrderAmount: numeric("min_order_amount"),
  maxDiscountAmount: numeric("max_discount_amount"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.uuid),
  quantity: integer("quantity").notNull().default(1),
  variationId: varchar("variation_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.uuid],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.uuid],
  }),
}));

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    productId: varchar("product_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (wishlistItems) => ({
    uniqueUserProduct: primaryKey(
      wishlistItems.userId,
      wishlistItems.productId
    ),
  })
);

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.uuid],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.uuid],
  }),
}));

export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.uuid),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const shippingMethods = pgTable("shipping_methods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  estimatedDeliveryTime: varchar("estimated_delivery_time", {
    length: 50,
  }).notNull(),
  isActive: boolean("is_active").default(true),
});
