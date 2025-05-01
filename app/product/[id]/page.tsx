import AddToCartForm from "@/components/add-to-cart-form";
import DeliveryInfo from "@/components/delivery-info";
import ProductAvailability from "@/components/product-availability";
import ProductBreadcrumb from "@/components/product-breadcrumb";
import ProductImageGallery from "@/components/product-image-gallery";
import ProductReviews from "@/components/product-reviews";
import ProductSpecifications from "@/components/product-specifications";
import RelatedProducts from "@/components/related-products";
import ShareButtons from "@/components/share-buttons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dbConnect from "@/lib/db/mongo/connection";
import ProductModel from "@/lib/db/mongo/models/product.model";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  await dbConnect();
  const product = await ProductModel.findOne({ id: params.id });

  if (!product) {
    return {
      title: "Product Not Found | AgriHub",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | AgriHub`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();

  // Fetch product from database
  const product = await ProductModel.findOne({ id: params.id });

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await ProductModel.find({
    category: product.category,
    id: { $ne: product.id },
    isActive: true,
  }).limit(4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Retour aux produits</span>
          </Link>
          <ProductBreadcrumb product={product} />
        </div>
        <ShareButtons title={product.name} description={product.description} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:sticky md:top-24 self-start">
          <Suspense
            fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}
          >
            <ProductImageGallery
              images={product.images || [product.image]}
              alt={product.name}
            />
          </Suspense>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.isNew && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
              {product.onSale && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Promotion
                </span>
              )}
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {product.region}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} avis)
              </span>
            </div>
          </div>

          <div className="text-sm sm:text-base text-gray-700 space-y-4">
            <p>{product.description}</p>
          </div>

          <div className="flex items-baseline gap-2 my-4">
            {product.salePrice ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold text-red-600">
                  {product.salePrice.toLocaleString()} Ar
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {product.price.toLocaleString()} Ar
                </span>
                <span className="text-sm text-red-600 font-medium">
                  {Math.round(
                    ((product.price - product.salePrice) / product.price) * 100
                  )}
                  % de réduction
                </span>
              </>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold">
                {product.price.toLocaleString()} Ar
              </span>
            )}
          </div>

          <ProductAvailability stock={product.stock} />

          <div className="border-t border-b py-4 my-6">
            <AddToCartForm product={product} />
          </div>

          <DeliveryInfo />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Spécifications</TabsTrigger>
                <TabsTrigger value="reviews">
                  Avis ({product.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  {product.attributes && product.attributes.length > 0 && (
                    <>
                      <h3>Caractéristiques</h3>
                      <ul>
                        {product.attributes.map((attribute, index) => (
                          <li key={index}>
                            <strong>{attribute.name}:</strong> {attribute.value}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <h3>Conseils d'utilisation</h3>
                  <p>
                    Pour profiter pleinement de ce produit, suivez les
                    recommandations d'utilisation et de conservation adaptées à
                    sa catégorie.
                  </p>
                  <h3>Conservation</h3>
                  <p>
                    Conservez ce produit dans un endroit frais et sec, à l'abri
                    de la lumière directe et de l'humidité pour préserver toutes
                    ses qualités.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications">
                <ProductSpecifications product={product} />
              </TabsContent>

              <TabsContent value="reviews">
                <ProductReviews
                  productId={product.id}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Informations vendeur</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-medium text-green-600">
                    {product.seller.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.seller}</p>
                  <p className="text-sm text-gray-500">{product.region}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Catégorie</p>
                <p>{product.category}</p>
              </div>

              {product.subcategory && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sous-catégorie</p>
                  <p>{product.subcategory}</p>
                </div>
              )}

              <Link href={`/seller/${product.sellerId}`}>
                <Button variant="outline" className="w-full">
                  Voir le profil du vendeur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <RelatedProducts
          products={relatedProducts}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}
