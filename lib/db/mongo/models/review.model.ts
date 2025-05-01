import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReviewResponse {
  text: string;
  date: string;
}

export interface IReview extends Document {
  id: string;
  productId: string;
  userId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
  response?: IReviewResponse;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewResponseSchema = new Schema<IReviewResponse>({
  text: { type: String, required: true },
  date: { type: String, required: true },
});

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    helpful: { type: Number, default: 0 },
    images: [String],
    response: ReviewResponseSchema,
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ rating: -1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
