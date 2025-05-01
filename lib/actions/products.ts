import { connectToDatabases } from "../db";
import Product, { IProduct } from "../db/mongo/models/product.model";

export async function getProducts(options?: {
  category?: string;
  region?: string;
  page?: number;
  limit?: number;
}) {
  await connectToDatabases();

  const query: any = {};

  if (options?.category) {
    query.category = options.category;
  }

  if (options?.region) {
    query.region = options.region;
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((options?.page || 0) * (options?.limit || 10))
    .limit(options?.limit || 10);

  return products;
}

export async function markReviewHelpful(reviewId: string, userId: string) {
  await connectToDatabases();

  const product = (await Product.findOne({
    "reviews.id": reviewId,
  })) as IProduct;

  if (!product) {
    throw new Error("Review not found");
  }

  const review = product.reviews?.find((r) => r.id === reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (!review.helpfulVotes.includes(userId)) {
    review.helpfulVotes.push(userId);
  }

  await product.save();
}

export async function addProductReview(formData: FormData) {
  const productId = formData.get("productId") as string;
  const userId = formData.get("userId") as string;
  const userName = formData.get("userName") as string;
  const rating = Number.parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  if (!productId || !userId || !userName || !rating || !comment) {
    return { error: "Tous les champs sont requis" };
  }

  const product = await Product.findById(productId);
  if (!product) {
    return { error: "Produit introuvable" };
  }

  const newReview = {
    id: `r${Date.now()}`,
    userId,
    user: userName,
    rating,
    comment,
    date: new Date().toISOString(),
    helpfulVotes: [],
  };

  product.reviews = product.reviews || [];
  product.reviews.push(newReview);
  await product.save();

  return { success: true, review: newReview };
}

export async function deleteProductReview(reviewId: string) {
  const product = await Product.findOne({ "reviews.id": reviewId });
  if (!product) {
    return { error: "Avis introuvable" };
  }

  product.reviews = (product.reviews || []).filter(
    (review) => review.id !== reviewId
  );
  await product.save();

  return { success: true };
}

export async function updateProductReview(
  reviewId: string,
  updatedReview: { rating: number; comment: string }
) {
  const product = await Product.findOne({ "reviews.id": reviewId });
  if (!product) {
    return { error: "Avis introuvable" };
  }

  const review = (product.reviews ?? []).find(
    (review) => review.id === reviewId
  );
  if (!review) {
    return { error: "Avis introuvable" };
  }

  review.rating = updatedReview.rating;
  review.comment = updatedReview.comment;
  await product.save();

  return { success: true, review };
}
