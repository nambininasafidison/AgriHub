import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getIntrants } from "@/lib/actions/intrants";
import { getProducts } from "@/lib/actions/products";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // Get featured products and intrants
  const products = await getProducts();
  const intrants = await getIntrants();

  // Take only the first 3 products and intrants
  const featuredProducts = products.slice(0, 3);
  const featuredIntrants = intrants.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section with background image */}
      <div className="relative -mt-[4.5rem] md:-mt-24 min-h-[90vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.png?height=1080&width=1920"
            alt="Madagascar agriculture"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 mb-4 text-white">
              <span className="text-sm">L'agriculture est essentielle</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Madagascar Agri-Commerce Hub
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              Connecter les agriculteurs et artisans malgaches avec les
              acheteurs et fournisseurs pour un commerce agricole plus équitable
              et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md w-full sm:w-auto">
                  Découvrir les produits
                </Button>
              </Link>
              <Link href="/intrants">
                <Button
                  variant="outline"
                  className="rounded-md hover:bg-white/10 w-full sm:w-auto"
                >
                  Voir les intrants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Catégories populaires
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Épices", "Fruits", "Légumes", "Artisanat"].map((category) => (
            <div
              key={category}
              className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt={category}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium">{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Produits en vedette */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0">
            Produits en vedette
          </h2>
          <Link
            href="/products"
            className="text-green-600 hover:underline flex items-center"
          >
            Voir tous <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                id: product.id,
                createdAt: product.createdAt.toString(),
                updatedAt: product.updatedAt.toString(),
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0">
            Intrants agricoles
          </h2>
          <Link
            href="/intrants"
            className="text-green-600 hover:underline flex items-center"
          >
            Voir tous <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredIntrants.map((intrant) => (
            <div
              key={intrant.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 p-4 flex items-center justify-center h-48">
                <Image
                  src={
                    (Array.isArray(intrant.image) &&
                      intrant.image.length > 0 &&
                      intrant.image[0]) ||
                    "/placeholder.svg"
                  }
                  alt={intrant.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{intrant.name}</h3>
                <p className="font-bold">
                  {intrant.price.toLocaleString()} Ar/{intrant.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Rejoignez la communauté Agrihub
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-white/90">
            Que vous soyez agriculteur, artisan ou acheteur, Agrihub vous offre
            une plateforme complète pour vendre vos produits ou trouver des
            intrants de qualité.
          </p>
          <Link href="/auth/register">
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
