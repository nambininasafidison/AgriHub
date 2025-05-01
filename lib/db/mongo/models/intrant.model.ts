import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IIntrantSpecification {
  name: string;
  value: string;
}

export interface IIntrant extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  image: string;
  supplier: string;
  supplierId: string;
  inStock: boolean;
  specifications?: IIntrantSpecification[];
  usageInstructions?: string;
  safetyInformation?: string;
  certifications?: string[];
  createdAt: Date;
  updatedAt: Date;
  reviews?: {
    id: string;
    userId: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

const ReviewSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, required: true },
  comment: { type: String, required: true },
});

const IntrantSpecificationSchema = new Schema<IIntrantSpecification>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const IntrantSchema = new Schema<IIntrant>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    supplier: { type: String, required: true },
    supplierId: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    specifications: [IntrantSpecificationSchema],
    usageInstructions: { type: String },
    safetyInformation: { type: String },
    certifications: [String],
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

IntrantSchema.index({ name: "text", description: "text" });
IntrantSchema.index({ category: 1 });
IntrantSchema.index({ supplierId: 1 });
IntrantSchema.index({ inStock: 1 });

const Intrant: Model<IIntrant> =
  mongoose.models.Intrant || mongoose.model<IIntrant>("Intrant", IntrantSchema);

export default Intrant;
