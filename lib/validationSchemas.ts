import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type User = z.infer<typeof userSchema>;

export const productSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
});

export const orderDetailsSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  userId: z.string().uuid("Invalid user ID"),
  products: z.array(
    z.object({
      productId: z.string().uuid("Invalid product ID"),
      quantity: z
        .number()
        .int()
        .positive("Quantity must be a positive integer"),
    })
  ),
  totalAmount: z.number().positive("Total amount must be a positive number"),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Invalid postal code"),
  country: z.string().min(1, "Country is required"),
});

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  cardHolderName: z.string().min(1, "Cardholder name is required"),
});

export const reviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  userId: z.string().uuid("Invalid user ID"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
  date: z.string().optional(),
});

export const productReviewResponseSchema = z.object({
  id: z.string().uuid("Invalid response ID"),
  reviewId: z.string().uuid("Invalid review ID"),
  text: z.string().min(1, "Response text is required"),
  date: z.string().optional(),
});

export const addressFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
  phone: z.string().regex(/^03[2-4]\d{7}$/, "Invalid phone number"),
});

export const paymentFormSchema = z.object({
  paymentMethod: z.enum(["mvola", "airtel", "orange"]).refine((val) => ["mvola", "airtel", "orange"].includes(val), {
    message: "Invalid payment method",
  }),
  phoneNumber: z.string().regex(/^03[2-4]\d{7}$/, "Invalid phone number"),
});

export const registrationFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
    role: z.enum(["farmer", "buyer", "supplier"]).refine((val) => ["farmer", "buyer", "supplier"].includes(val), {
      message: "Invalid role",
    }),
    region: z.string().optional(),
    specialty: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const promotionFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    type: z.string().min(1, "Type is required"),
    value: z.number().positive("Value must be a positive number"),
    code: z.string().min(1, "Code is required"),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export const promotionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z
    .enum(["percentage", "fixed", "free_shipping", "buy_x_get_y"])
    .refine((val) => ["percentage", "fixed", "free_shipping", "buy_x_get_y"].includes(val), {
      message: "Invalid promotion type",
    }),
  value: z.number().positive("Value must be a positive number"),
  code: z.string().min(1, "Code is required"),
  startDate: z.date(),
  endDate: z.date(),
  usageLimit: z
    .number()
    .int()
    .nonnegative("Usage limit must be a non-negative integer")
    .optional(),
  isActive: z.boolean().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["percentage", "fixed"]).refine((val) => ["percentage", "fixed"].includes(val), {
    message: "Invalid coupon type",
  }),
  value: z.number().positive("Value must be a positive number"),
  minPurchase: z
    .number()
    .nonnegative("Minimum purchase must be a non-negative number")
    .optional(),
  maxDiscount: z
    .number()
    .nonnegative("Maximum discount must be a non-negative number")
    .optional(),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().optional(),
});

export const cartItemSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  variationId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const shippingInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
  phone: z.string().regex(/^03[2-4]\d{7}$/, "Invalid phone number"),
});

export const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().regex(/^03[2-4]\d{7}$/, "Invalid phone number"),
  paymentMethod: z
    .enum(["mvola", "airtel", "orange"])
    .refine((val) => ["mvola", "airtel", "orange"].includes(val), {
      message: "Invalid payment method",
    }),
  shippingMethodId: z.string().uuid("Invalid shipping method ID"),
});

export const cartUpdateSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const wishlistItemSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  addedAt: z.string().optional(),
});

export const shippingMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  estimatedDeliveryTime: z
    .string()
    .min(1, "Estimated delivery time is required"),
  isActive: z.boolean().optional(),
});

export const productReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  userId: z.string().uuid("Invalid user ID"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
  title: z.string().optional(),
  date: z.string().optional(),
});

export const activitySchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  type: z.string().min(1, "Activity type is required"),
  description: z.string().min(1, "Description is required"),
  createdAt: z.string().optional(),
});

export const userActivityLogSchema = z.object({
  id: z.string().uuid("Invalid activity log ID"),
  userId: z.string().uuid("Invalid user ID"),
  action: z.string().min(1, "Action is required"),
  timestamp: z.string().optional(),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  expiresAt: z.string().optional(),
});

export const notificationSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
  userId: z.string().uuid("Invalid user ID"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "success", "warning", "error"]),
  read: z.boolean().optional(),
  createdAt: z.string().optional(),
  link: z.string().url("Invalid URL").optional(),
});

export const currencySchema = z.object({
  code: z.string().min(1, "Currency code is required"),
  name: z.string().min(1, "Currency name is required"),
  symbol: z.string().min(1, "Currency symbol is required"),
  exchangeRate: z.number().positive("Exchange rate must be a positive number"),
});

export const dashboardDataSchema = z.object({
  totalSales: z
    .number()
    .nonnegative("Total sales must be a non-negative number"),
  orderCount: z
    .number()
    .int()
    .nonnegative("Order count must be a non-negative integer"),
  customerCount: z
    .number()
    .int()
    .nonnegative("Customer count must be a non-negative integer"),
  productCount: z
    .number()
    .int()
    .nonnegative("Product count must be a non-negative integer"),
  lowStockProducts: z.array(z.any()).optional(),
  recentOrders: z.array(z.any()).optional(),
  ordersByStatus: z.object({
    pending: z
      .number()
      .int()
      .nonnegative("Pending orders must be a non-negative integer"),
    confirmed: z
      .number()
      .int()
      .nonnegative("Confirmed orders must be a non-negative integer"),
    shipped: z
      .number()
      .int()
      .nonnegative("Shipped orders must be a non-negative integer"),
    delivered: z
      .number()
      .int()
      .nonnegative("Delivered orders must be a non-negative integer"),
    cancelled: z
      .number()
      .int()
      .nonnegative("Cancelled orders must be a non-negative integer"),
  }),
});

export const productVariationSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  name: z.string().min(1, "Variation name is required"),
  price: z.number().positive("Price must be a positive number").optional(),
  stock: z
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export const shippingZoneSchema = z.object({
  id: z.string().uuid("Invalid shipping zone ID"),
  name: z.string().min(1, "Name is required"),
  countries: z.array(z.string().min(1, "Country name is required")),
  regions: z.array(z.string().min(1, "Region name is required")).optional(),
  postalCodes: z.array(z.string().min(1, "Postal code is required")).optional(),
  shippingMethods: z.array(z.any()),
});

export const shippingRegionSchema = z.object({
  id: z.string().uuid("Invalid region ID"),
  name: z.string().min(1, "Region name is required"),
  countries: z.array(z.string().min(1, "Country name is required")),
});

export const appliedPromotionSchema = z.object({
  id: z.string().uuid("Invalid promotion ID"),
  name: z.string().min(1, "Promotion name is required"),
  type: z.string().min(1, "Promotion type is required"),
  value: z.number().positive("Value must be a positive number"),
  discountAmount: z
    .number()
    .nonnegative("Discount amount must be a non-negative number"),
});

export const productAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
});

export const productDimensionsSchema = z.object({
  length: z.number().positive("Length must be a positive number"),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
});

export const userPreferencesSchema = z.object({
  language: z.string().min(1, "Language is required"),
  currency: z.string().min(1, "Currency is required"),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  newsletter: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  orderUpdates: z.boolean().optional(),
});

export const intrantSchema = z.object({
  id: z.string().uuid("Invalid intrant ID"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5").optional(),
  reviews: z.array(z.any()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

export const analyticsSchema = z.object({
  path: z.string().min(1, "Path is required"),
  userId: z.string().uuid("Invalid user ID").optional(),
  sessionId: z.string().min(1, "Session ID is required"),
  referrer: z.string().url("Invalid referrer URL").optional(),
  duration: z
    .number()
    .nonnegative("Duration must be a non-negative number")
    .optional(),
  timestamp: z.string().optional(),
});

export const productCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export const productTagSchema = z.object({
  id: z.string().uuid("Invalid tag ID"),
  name: z.string().min(1, "Tag name is required"),
});

export const userRoleSchema = z.enum(["admin", "farmer", "buyer", "supplier"]);

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map((err) => err.message).join(", "));
  }
  return result.data;
};

export const productVariationOptionSchema = z.object({
  id: z.string().uuid("Invalid variation option ID"),
  name: z.string().min(1, "Option name is required"),
  value: z.string().min(1, "Option value is required"),
});

export const shippingCostSchema = z.object({
  region: z.string().min(1, "Region is required"),
  weight: z.number().positive("Weight must be a positive number"),
  cost: z.number().positive("Cost must be a positive number"),
});

export const orderTrackingSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  carrier: z.string().min(1, "Carrier is required"),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
  updatedAt: z.string().optional(),
});

export const productSpecificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

export const userNotificationSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
  userId: z.string().uuid("Invalid user ID"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "success", "warning", "error"]),
  read: z.boolean().optional(),
  createdAt: z.string().optional(),
});

export const storeDetailsSchema = z.object({
  id: z.string().uuid("Invalid store ID"),
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  ownerId: z.string().uuid("Invalid owner ID"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const deliveryOptionSchema = z.object({
  id: z.string().uuid("Invalid delivery option ID"),
  name: z.string().min(1, "Delivery option name is required"),
  price: z.number().positive("Price must be a positive number"),
  estimatedTime: z.string().min(1, "Estimated time is required"),
});

export const promotionalBannerSchema = z.object({
  id: z.string().uuid("Invalid banner ID"),
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Invalid image URL"),
  link: z.string().url("Invalid link URL").optional(),
  isActive: z.boolean().optional(),
});

export const auditLogSchema = z.object({
  id: z.string().uuid("Invalid log ID"),
  userId: z.string().uuid("Invalid user ID"),
  action: z.string().min(1, "Action is required"),
  timestamp: z.string().optional(),
  details: z.string().optional(),
});

export const systemSettingsSchema = z.object({
  key: z.string().min(1, "Setting key is required"),
  value: z.string().min(1, "Setting value is required"),
  description: z.string().optional(),
});

export const apiKeySchema = z.object({
  id: z.string().uuid("Invalid API key ID"),
  key: z.string().min(1, "API key is required"),
  userId: z.string().uuid("Invalid user ID"),
  createdAt: z.string().optional(),
  expiresAt: z.string().optional(),
});
