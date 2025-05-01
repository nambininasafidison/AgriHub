import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProductAttribute {
  name: string;
  value: string;
}

export interface IProductVariationOption {
  id: string;
  variationId: string;
  name: string;
  priceModifier: number;
  stockQuantity: number;
  sku?: string;
}

export interface IProductVariation {
  id: string;
  productId: string;
  name: string;
  options: IProductVariationOption[];
}

export interface IProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IReview {
  id: string;
  userId: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  helpfulVotes: string[];
}

export interface IProduct extends Document {
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
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  varieties?: string[];
  variations?: IProductVariation[];
  attributes?: IProductAttribute[];
  weight: number;
  dimensions?: IProductDimensions;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  isFeatured?: boolean;
  isNewProduct?: boolean;
  onSale?: boolean;
  tags?: string[];
  reviews?: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductAttributeSchema = new Schema<IProductAttribute>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductVariationOptionSchema = new Schema<IProductVariationOption>({
  id: { type: String, required: true },
  variationId: { type: String, required: true },
  name: { type: String, required: true },
  priceModifier: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  sku: { type: String },
});

const ProductVariationSchema = new Schema<IProductVariation>({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  options: [ProductVariationOptionSchema],
});

const ProductDimensionsSchema = new Schema<IProductDimensions>({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});

const ReviewSchema = new Schema<IReview>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, required: true },
  comment: { type: String, required: true },
  helpfulVotes: { type: [String], default: [] },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    region: { type: String },
    seller: { type: String },
    sellerId: { type: String, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String },
    images: [{ type: String }],
    varieties: [{ type: String }],
    variations: [ProductVariationSchema],
    attributes: [ProductAttributeSchema],
    weight: { type: Number },
    dimensions: ProductDimensionsSchema,
    sku: { type: String },
    barcode: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    tags: [{ type: String }],
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ region: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
