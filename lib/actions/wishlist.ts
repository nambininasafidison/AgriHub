"use server";

import dbConnect from "@/lib/db/mongo/connection";
import { revalidatePath } from "next/cache";
import Wishlist from "../db/mongo/models/wishlist.model";
import { WishlistItem } from "../types";
import { getSession } from "./auth";

export async function getWishlist(): Promise<WishlistItem[]> {
  const session = await getSession();

  if (!session) {
    return [];
  }

  await dbConnect();
  const wishlist = (await Wishlist.findOne({
    userId: session.id,
  })) as WishlistItem[];

  return wishlist;
}

export async function addToWishlist(productId: string): Promise<void> {
  const session = await getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.id },
    { $addToSet: { items: productId } },
    { upsert: true, new: true }
  );

  if (!wishlist) {
    throw new Error("Failed to add item to wishlist");
  }

  revalidatePath("/wishlist");
  revalidatePath(`/product/${productId}`);
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const session = await getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.id },
    { $pull: { items: productId } },
    { new: true }
  );

  if (!wishlist) {
    throw new Error("Failed to remove item from wishlist");
  }

  revalidatePath("/wishlist");
  revalidatePath(`/product/${productId}`);
}

export async function clearWishlist(): Promise<void> {
  const session = await getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.id },
    { $set: { items: [] } },
    { new: true }
  );

  if (!wishlist) {
    throw new Error("Failed to clear wishlist");
  }

  revalidatePath("/wishlist");
}
