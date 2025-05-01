"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import dbConnect from "@/lib/db/mongo/connection";
import ProductModel from "@/lib/db/mongo/models/product.model";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    subcategory?: string;
    region?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  await dbConnect();

  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const region = searchParams.region;
  const sort = searchParams.sort || "newest";
  const page = Number.parseInt(searchParams.page || "1");
  const limit = 12;

  const query: any = { isActive: true };

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (region) query.region = region;

  let sortOptions: any = {};
  switch (sort) {
    case "price-asc":
      sortOptions = { price: 1 };
      break;
    case "price-desc":
      sortOptions = { price: -1 };
      break;
    case "rating":
      sortOptions = { rating: -1 };
      break;
    case "newest":
    default:
      sortOptions = { createdAt: -1 };
  }

  const skip = (page - 1) * limit;
  const products = await ProductModel.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await ProductModel.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const categories = await ProductModel.distinct("category");

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 mb-4 sm:mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {category ? `${category}` : "Tous les Produits"}
          {subcategory ? ` - ${subcategory}` : ""}
          {region ? ` de ${region}` : ""}
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Trier par:
          </span>
          <Select
            defaultValue={sort}
            onValueChange={(value) => {
              const url = new URL(window.location.href);
              url.searchParams.set("sort", value);
              window.location.href = url.toString();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nouveautés</SelectItem>
              <SelectItem value="price-asc">Prix: Croissant</SelectItem>
              <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
              <SelectItem value="rating">Popularité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hidden md:block">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="font-semibold mb-4">Filtres</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Catégories</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block text-sm ${
                      !category
                        ? "text-green-600 font-medium"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    Toutes les catégories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${encodeURIComponent(cat)}`}
                      className={`block text-sm ${
                        category === cat
                          ? "text-green-600 font-medium"
                          : "text-gray-600 hover:text-green-600"
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            }
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      ...product,
                      createdAt: product.createdAt.toISOString(),
                      updatedAt: product.updatedAt.toISOString(),
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-4">Aucun produit trouvé.</p>
                <Link href="/products">
                  <Button variant="outline">Voir tous les produits</Button>
                </Link>
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                {page > 1 && (
                  <Link
                    href={{
                      pathname: "/products",
                      query: {
                        ...searchParams,
                        page: page - 1,
                      },
                    }}
                    className="px-3 py-2 rounded-md border hover:bg-gray-50"
                  >
                    Précédent
                  </Link>
                )}

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show only current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <Link
                        key={pageNumber}
                        href={{
                          pathname: "/products",
                          query: {
                            ...searchParams,
                            page: pageNumber,
                          },
                        }}
                        className={`px-3 py-2 rounded-md ${
                          pageNumber === page
                            ? "bg-green-600 text-white"
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  } else if (
                    (pageNumber === 2 && page > 3) ||
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return <span key={pageNumber}>...</span>;
                  }
                  return null;
                })}

                {page < totalPages && (
                  <Link
                    href={{
                      pathname: "/products",
                      query: {
                        ...searchParams,
                        page: page + 1,
                      },
                    }}
                    className="px-3 py-2 rounded-md border hover:bg-gray-50"
                  >
                    Suivant
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
