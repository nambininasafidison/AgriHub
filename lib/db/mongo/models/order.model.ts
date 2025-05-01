import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  variety?: string;
  variationId?: string;
  variationName?: string;
  weight: number;
  subtotal: number;
  sellerId: string;
}

export interface IAppliedPromotion {
  id: string;
  name: string;
  type: string;
  value: number;
  discountAmount: number;
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  userId: string;
  customer: string;
  customerEmail: string;
  date: string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  paymentMethod: string;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
  appliedPromotions?: IAppliedPromotion[];
  currency: string;
  notes?: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  variety: { type: String },
  variationId: { type: String },
  variationName: { type: String },
  weight: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const AppliedPromotionSchema = new Schema<IAppliedPromotion>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true },
    orderNumber: { type: String, required: true },
    userId: { type: String, required: true },
    customer: { type: String, required: true },
    customerEmail: { type: String, required: true },
    date: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    trackingNumber: { type: String },
    carrier: { type: String },
    appliedPromotions: [AppliedPromotionSchema],
    currency: { type: String, default: "MGA" },
    notes: { type: String },
    sellerId: { type: String, required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
