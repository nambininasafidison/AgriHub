import dbConnect from "@/lib/db/mongo/connection"
import { Product } from "@/lib/db/mongo/models"
import type { Product as ProductType } from "@/lib/types"

export async function getProducts(options: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
  featured?: boolean
  minPrice?: number
  maxPrice?: number
}) {
  try {
    const { page = 1, limit = 10, category, search, sort = "createdAt_desc", featured, minPrice, maxPrice } = options

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (featured) {
      query.isFeatured = true
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}

      if (minPrice !== undefined) {
        query.price.$gte = minPrice
      }

      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice
      }
    }

    // Parse sort parameter
    const [sortField, sortDirection] = sort.split("_")
    const sortOptions: any = {}
    sortOptions[sortField] = sortDirection === "asc" ? 1 : -1

    // Connect to database
    await dbConnect()

    // Execute query with pagination
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean()

    // Get total count for pagination
    const total = await Product.countDocuments(query)

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error getting products:", error)
    throw error
  }
}

export async function getProductById(id: string) {
  try {
    await dbConnect()

    const product = await Product.findById(id).lean()

    return product
  } catch (error) {
    console.error(`Error getting product ${id}:`, error)
    throw error
  }
}

export async function createProduct(productData: Omit<ProductType, "id">) {
  try {
    await dbConnect()

    const product = new Product(productData)
    await product.save()

    return product.toObject()
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, productData: Partial<ProductType>) {
  try {
    await dbConnect()

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true, runValidators: true },
    ).lean()

    return product
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect()

    const product = await Product.findByIdAndDelete(id).lean()

    return product
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

export async function getProductsByCategory(category: string, limit = 10) {
  try {
    await dbConnect()

    const products = await Product.find({ category }).limit(limit).lean()

    return products
  } catch (error) {
    console.error(`Error getting products by category ${category}:`, error)
    throw error
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    await dbConnect()

    const products = await Product.find({ isFeatured: true }).limit(limit).lean()

    return products
  } catch (error) {
    console.error("Error getting featured products:", error)
    throw error
  }
}

export async function getNewProducts(limit = 8) {
  try {
    await dbConnect()

    const products = await Product.find({ isNew: true }).limit(limit).lean()

    return products
  } catch (error) {
    console.error("Error getting new products:", error)
    throw error
  }
}

export async function getRelatedProducts(productId: string, limit = 4) {
  try {
    await dbConnect()

    const product = await Product.findById(productId).lean()

    if (!product) {
      throw new Error("Product not found")
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: Array.isArray(product) ? undefined : product.category,
    })
      .limit(limit)
      .lean()

    return relatedProducts
  } catch (error) {
    console.error(`Error getting related products for ${productId}:`, error)
    throw error
  }
}

export async function searchProducts(query: string, limit = 10) {
  try {
    await dbConnect()

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .limit(limit)
      .lean()

    return products
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error)
    throw error
  }
}

export async function updateProductStock(id: string, quantity: number) {
  try {
    await dbConnect()

    const product = await Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true }).lean()

    return product
  } catch (error) {
    console.error(`Error updating stock for product ${id}:`, error)
    throw error
  }
}
