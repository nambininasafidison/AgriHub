import mongoose, { Document, Model, Schema } from "mongoose";
import { Product } from "../models";

interface IWishlist extends Document {
  id: string;
  userId: string;
  product?: typeof Product;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
