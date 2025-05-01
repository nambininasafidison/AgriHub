import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIntrantById, getIntrantReviews } from "@/lib/actions/intrants";
import { notFound } from "next/navigation";

export default async function IntrantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const intrant = await getIntrantById(params.id);

  if (!intrant) {
    notFound();
  }

  const reviews = await getIntrantReviews(params.id);

  return (
    <div className="space-y-8">
      <Link href="/intrants" className="inline-flex items-center text-gray-600">
        <ArrowLeft size={16} className="mr-2" />
        <span>Retour aux intrants</span>
      </Link>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <Image
              src={intrant.images[0] || "/placeholder.svg"}
              alt={intrant.name}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                {intrant.category}
              </div>
              <h1 className="text-3xl font-bold mb-2">{intrant.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(intrant.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {intrant.rating} ({reviews.length} avis)
                </span>
              </div>
            </div>

            <div>
              <p className="text-gray-600">{intrant.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fournisseur</p>
              <p className="font-medium">{intrant.vendorId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Prix</p>
              <p className="text-3xl font-bold">
                {intrant.price.toLocaleString()} Ar
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Disponibilité</p>
              <p
                className={`font-medium ${
                  intrant.stock ? "text-green-600" : "text-red-600"
                }`}
              >
                {intrant.stock ? "En stock" : "Rupture de stock"}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={!intrant.stock}
              >
                <ShoppingBag className="h-4 w-4" />
                Ajouter au panier
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Ajouter aux favoris</span>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs">Livraison rapide</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs">Qualité garantie</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs">Retour sous 14 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Tabs defaultValue="specifications">
          <TabsList className="mb-4">
            <TabsTrigger value="specifications">Spécifications</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications">
            {intrant.specifications ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Caractéristiques techniques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(intrant.specifications) &&
                    intrant.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b"
                      >
                        <span className="text-gray-600">{spec.name}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Aucune spécification disponible pour ce produit.
              </p>
            )}
          </TabsContent>
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">
                    {intrant.rating.toFixed(1)}
                  </span>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(intrant.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {reviews.length} avis
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun avis pour ce produit.</p>
                    <Button variant="outline" className="mt-4">
                      Soyez le premier à donner votre avis
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
