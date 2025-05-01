"use server"

import dbConnect from "@/lib/db/mongo/connection"
import ProductModel from "@/lib/db/mongo/models/product.model"
import type { FilterState } from "@/contexts/search-context"

type SearchResult = {
  products: any[]
  totalProducts: number
  totalPages: number
  currentPage: number
}

export async function searchProducts(filters: FilterState): Promise<SearchResult> {
  try {
    await dbConnect()

    const { query, category, minPrice, maxPrice, inStock, rating, sort, page = 1 } = filters

    const limit = 12 // Products per page
    const skip = (page - 1) * limit

    // Build query
    const queryObj: any = {}

    // Text search
    if (query) {
      queryObj.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ]
    }

    // Categories
    if (category && category.length > 0) {
      queryObj.category = { $in: category }
    }

    // Price range
    if (minPrice !== null || maxPrice !== null) {
      queryObj.price = {}
      if (minPrice !== null) queryObj.price.$gte = minPrice
      if (maxPrice !== null) queryObj.price.$lte = maxPrice
    }

    // Stock
    if (inStock) {
      queryObj.stock = { $gt: 0 }
    }

    // Rating
    if (rating !== null) {
      queryObj.rating = { $gte: rating }
    }

    // Build sort
    let sortObj: any = { createdAt: -1 } // Default: newest

    switch (sort) {
      case "price-asc":
        sortObj = { price: 1 }
        break
      case "price-desc":
        sortObj = { price: -1 }
        break
      case "popular":
        sortObj = { popularity: -1 }
        break
      case "rating":
        sortObj = { rating: -1 }
        break
    }

    // Execute query
    const totalProducts = await ProductModel.countDocuments(queryObj)
    const totalPages = Math.ceil(totalProducts / limit)

    const products = await ProductModel.find(queryObj).sort(sortObj).skip(skip).limit(limit).lean()

    return {
      products,
      totalProducts,
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Search error:", error)
    return {
      products: [],
      totalProducts: 0,
      totalPages: 0,
      currentPage: 1,
    }
  }
}
