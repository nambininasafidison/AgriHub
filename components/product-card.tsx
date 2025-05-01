"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!product.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      // Show success message or update cart count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="block aspect-square overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {product.onSale && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
            Sale
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2 flex items-center">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(product.salePrice || product.price)}
          </span>

          {product.salePrice && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {product.rating && (
              <div className="flex items-center">
                <span className="mr-1 text-yellow-400">★</span>
                <span className="text-xs text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            {product.reviewCount !== undefined && (
              <span className="ml-1 text-xs text-gray-500">
                ({product.reviewCount}{" "}
                {product.reviewCount === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>

          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock <= 0}
              className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-300"
            >
              {isLoading
                ? "Adding..."
                : product.stock <= 0
                ? "Out of stock"
                : "Add to cart"}
            </button>
          )}
        </div>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
