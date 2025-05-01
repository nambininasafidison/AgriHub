export type UserRole = "farmer" | "buyer" | "supplier";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | UserRole;
  region?: string;
  specialty?: string;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  addresses?: Address[];
  preferences?: UserPreferences;
}

export interface Address {
  id: string;
  userId?: string;
  name: string;
  phone?: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  type: "shipping" | "billing" | "both";
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  newsletter?: boolean;
  marketingEmails?: boolean;
  orderUpdates?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  subcategory?: string;
  region: string;
  seller: string;
  sellerId: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  varieties?: string[];
  variations?: ProductVariation[];
  attributes?: ProductAttribute[];
  weight: number;
  dimensions?: ProductDimensions;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  status?: "active" | "inactive" | "draft";
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  options: ProductVariationOption[];
}

export interface ProductVariationOption {
  id: string;
  variationId: string;
  name: string;
  priceModifier: number;
  stockQuantity: number;
  sku?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: string;
  userName?: string;
  rating: number;
  comment: string;
  title?: string;
  date?: string;
  createdAt?: string;
  helpful: number;
  images?: string[];
  response?: {
    text: string;
    date: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variationId?: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  variety?: string;
  variationName?: string;
  weight?: number;
  subtotal?: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  customer?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address | string;
  billingAddress?: Address;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  couponCode?: string;
  shippingCost?: number;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
  appliedPromotions?: any;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
  value: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  isActive: boolean;
}

export interface Intrant {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  featured?: boolean;
  status: "active" | "inactive" | "draft";
  usageInstructions?: string;
  safetyInformation?: string;
  certifications?: string[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDeliveryTime: string;
  isActive: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  regions?: string[];
  postalCodes?: string[];
  shippingMethods: ShippingMethod[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  processingFee?: number;
  icon?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  product: Product;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

export interface DashboardData {
  totalSales: number;
  orderCount: number;
  customerCount: number;
  productCount: number;
  lowStockProducts: any[];
  recentOrders: Order[];
  ordersByStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}
