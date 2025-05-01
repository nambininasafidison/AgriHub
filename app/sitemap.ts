import { connectToDatabases } from "@/lib/db";
import Intrant from "@/lib/db/mongo/models/intrant.model";
import ProductModel from "@/lib/db/mongo/models/product.model";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { mongo } = await connectToDatabases();
  if (!mongo) {
    console.error("Failed to connect to MongoDB");
    throw new Error("Database connection failed");
  }

  const products = await ProductModel.find({ isActive: true })
    .select("id updatedAt")
    .lean();

  const intrants = await Intrant.find({ inStock: true })
    .select("id updatedAt")
    .lean();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://agrihub.mg";

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/intrants`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap;

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  const intrantRoutes = intrants.map((intrant) => ({
    url: `${baseUrl}/intrant/${intrant.id}`,
    lastModified: intrant.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  return [...routes, ...productRoutes, ...intrantRoutes];
}
