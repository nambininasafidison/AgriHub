import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dbConnect from "@/lib/db/mongo/connection";
import ProductModel from "@/lib/db/mongo/models/product.model";
import { ChevronDown, Filter, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function MarketplacePage() {
  await dbConnect();

  // Fetch products from MongoDB
  const products = await ProductModel.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(8);

  // Fetch categories for filter
  const categories = await ProductModel.distinct("category");

  // Fetch regions for filter
  const regions = await ProductModel.distinct("region");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Agricultural Marketplace</h1>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown would go here */}
          </div>

          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Region
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown would go here */}
          </div>

          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Price Range
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown would go here */}
          </div>
        </div>

        <div className="relative">
          <Button variant="outline" className="flex items-center gap-2">
            Sort By: Featured
            <ChevronDown className="h-4 w-4" />
          </Button>
          {/* Dropdown would go here */}
        </div>
      </div>

      {/* Products Grid */}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden h-full hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="relative h-48">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white rounded-full hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      <Link
                        href={`/product/${product.id}`}
                        className="hover:text-green-600"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Sold by {product.seller}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={
                          i < Math.floor(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">
                    {product.rating}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Region: {product.region}
                </p>

                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">
                    Ar {product.price.toLocaleString()}
                  </p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Suspense>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-80 w-full" />
      ))}
    </div>
  );
}
