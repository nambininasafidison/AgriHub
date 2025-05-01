import Product from "@/lib/db/mongo/models/product.model";

export async function getStockByProductId(productId: string) {
  try {
    const product = await Product.findById(productId).select("stock").lean();

    if (!product) {
      return { error: "Stock introuvable" };
    }

    return { stock: product.stock };
  } catch (error) {
    console.error("Error fetching stock:", error);
    return {
      error: "Une erreur est survenue lors de la récupération du stock",
    };
  }
}

export async function updateStock(productId: string, quantity: number) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { stock: quantity } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return { error: "Stock introuvable" };
    }

    return { success: true, stock: updatedProduct.stock };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { error: "Une erreur est survenue lors de la mise à jour du stock" };
  }
}

export async function updateProductStock(productId: string, quantity: number) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { stock: quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      return { error: "Product not found" };
    }

    return { success: true, stock: updatedProduct.stock };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
