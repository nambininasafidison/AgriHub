import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variety?: string
  variationId?: string
  variationName?: string
  weight: number
  subtotal: number
}

export interface IAppliedPromotion {
  id: string
  name: string
  type: string
  value: number
  discountAmount: number
}

export interface ICart extends Document {
  id: string
  userId?: string
  sessionId: string
  items: ICartItem[]
  subtotal: number
  shippingCost?: number
  taxAmount?: number
  discountAmount?: number
  total?: number
  appliedPromotions?: IAppliedPromotion[]
  currency: string
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  variety: { type: String },
  variationId: { type: String },
  variationName: { type: String },
  weight: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
})

const AppliedPromotionSchema = new Schema<IAppliedPromotion>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
})

const CartSchema = new Schema<ICart>(
  {
    id: { type: String, required: true },
    userId: { type: String },
    sessionId: { type: String, required: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
    shippingCost: { type: Number },
    taxAmount: { type: Number },
    discountAmount: { type: Number },
    total: { type: Number },
    appliedPromotions: [AppliedPromotionSchema],
    currency: { type: String, default: "MGA" },
  },
  { timestamps: true },
)

CartSchema.index({ userId: 1 })
CartSchema.index({ sessionId: 1 })

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)

export default Cart
