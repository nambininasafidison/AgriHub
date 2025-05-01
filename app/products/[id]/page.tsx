import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/db/repository/product-repository"
import { ProductBreadcrumb } from "@/components/product-breadcrumb"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { ProductSpecifications } from "@/components/product-specifications"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { ShareButtons } from "@/components/share-buttons"
import { ProductAvailability } from "@/components/product-availability"
import { DeliveryInfo } from "@/components/delivery-info"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      notFound()
    }

    const relatedProducts = await getRelatedProducts(params.id)

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductBreadcrumb category={product.category} subcategory={product.subcategory} productName={product.name} />

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
              <ProductImageGallery images={product.images || [product.image]} />
            </Suspense>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

            <div className="mt-2 flex items-center">
              {product.rating && (
                <div className="flex items-center">
                  <span className="mr-1 text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              )}

              {product.reviewCount !== undefined && (
                <span className="ml-1 text-sm text-gray-500">
                  ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              )}

              <span className="mx-2 text-gray-300">|</span>

              <span className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xl font-bold text-gray-900">
                {product.salePrice ? (
                  <>
                    <span>{product.salePrice.toLocaleString()} MGA</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.price.toLocaleString()} MGA
                    </span>
                  </>
                ) : (
                  <span>{product.price.toLocaleString()} MGA</span>
                )}
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <p>{product.description}</p>
            </div>

            <div className="mt-6">
              <Suspense fallback={<div className="h-12 w-full bg-gray-100 animate-pulse"></div>}>
                <AddToCartForm product={product} />
              </Suspense>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProductAvailability stock={product.stock} />
              <DeliveryInfo />
            </div>

            <div className="mt-6">
              <ShareButtons title={product.name} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ProductSpecifications product={product} />
        </div>

        <div className="mt-12">
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse"></div>}>
            <ProductReviews productId={params.id} />
          </Suspense>
        </div>

        <div className="mt-12">
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse"></div>}>
            <RelatedProducts products={relatedProducts} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading product ${params.id}:`, error)
    notFound()
  }
}
