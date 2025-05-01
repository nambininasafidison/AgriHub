"use server";

import dbConnect from "@/lib/db/mongo/connection";
import Intrant from "../db/mongo/models/intrant.model";

export async function getIntrants() {
  await dbConnect();
  const intrants = await Intrant.find();
  return intrants;
}

export async function getIntrantById(id: string) {
  await dbConnect();
  const intrant = await Intrant.findById(id);
  return intrant || null;
}

export async function getIntrantReviews(intrantId: string) {
  await dbConnect();
  const intrant = await Intrant.findById(intrantId).select("reviews");
  return intrant?.reviews || [];
}

export async function addIntrantReview(formData: FormData) {
  const intrantId = formData.get("intrantId") as string;
  const userId = formData.get("userId") as string;
  const userName = formData.get("userName") as string;
  const rating = Number.parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  if (!intrantId || !userId || !userName || !rating || !comment) {
    return { error: "Tous les champs sont requis" };
  }

  await dbConnect();
  const intrant = await Intrant.findById(intrantId);
  if (!intrant) {
    return { error: "Intrant introuvable" };
  }

  const newReview = {
    id: `ir${Date.now()}`,
    userId,
    user: userName,
    rating,
    date: new Date().toLocaleDateString("fr-FR"),
    comment,
  };

  intrant.reviews = intrant.reviews || [];
  intrant.reviews.push(newReview);
  await intrant.save();

  return { success: true, review: newReview };
}
