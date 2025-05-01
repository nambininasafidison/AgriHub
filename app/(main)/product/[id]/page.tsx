import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Heart,
  Share2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would normally come from a database
  const product = {
    id: params.id,
    name: "Premium Vanilla",
    description:
      "High-quality vanilla beans harvested from the lush plantations of Analanjirofo region. These premium vanilla beans are carefully cultivated and processed to preserve their rich aroma and flavor. Perfect for baking, cooking, or making homemade vanilla extract.",
    price: 150000,
    salePrice: null as number | null,
    category: "Spices",
    subcategory: "Vanilla",
    region: "Analanjirofo",
    seller: "Rakoto Jean",
    sellerId: "user-1",
    stock: 50,
    rating: 4.5,
    reviewCount: 25,
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600&text=Image+2",
      "/placeholder.svg?height=600&width=600&text=Image+3",
      "/placeholder.svg?height=600&width=600&text=Image+4",
    ],
    varieties: ["Grade A", "Grade B", "Extract Ready"],
    attributes: {
      origin: "Madagascar",
      cultivation: "Organic",
      certification: "Fair Trade",
      harvestDate: "2025-03",
    },
    weight: 0.1, // kg
    dimensions: "15 × 2 × 2 cm",
    reviews: [
      {
        id: 1,
        user: "Rasoa Marie",
        rating: 5,
        date: "2025-04-10",
        comment:
          "Excellent quality vanilla beans. The aroma is incredible and they add wonderful flavor to my baking.",
      },
      {
        id: 2,
        user: "Randria Paul",
        rating: 4,
        date: "2025-04-05",
        comment: "Very good quality. Shipped quickly and well packaged.",
      },
      {
        id: 3,
        user: "Jean Pierre",
        rating: 5,
        date: "2025-03-28",
        comment:
          "These vanilla beans are the best I've ever used. Worth every ariary!",
      },
    ],
    relatedProducts: [
      {
        id: 5,
        name: "Cloves",
        price: 80000,
        image: "/placeholder.svg?height=200&width=200",
        seller: "Rasoa Marie",
        rating: 4.6,
      },
      {
        id: 9,
        name: "Black Pepper",
        price: 35000,
        image: "/placeholder.svg?height=200&width=200",
        seller: "Rakoto Jean",
        rating: 4.3,
      },
      {
        id: 10,
        name: "Cinnamon Sticks",
        price: 40000,
        image: "/placeholder.svg?height=200&width=200",
        seller: "Randria Paul",
        rating: 4.4,
      },
      {
        id: 11,
        name: "Vanilla Extract",
        price: 65000,
        image: "/placeholder.svg?height=200&width=200",
        seller: "Rakoto Jean",
        rating: 4.7,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/marketplace"
                  className="text-gray-700 hover:text-green-600"
                >
                  Marketplace
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href={`/marketplace?category=${product.category}`}
                  className="text-gray-700 hover:text-green-600"
                >
                  {product.category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 border rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className="relative h-24 border rounded-lg overflow-hidden cursor-pointer hover:border-green-500"
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5"
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold">
                Ar {product.price.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  Ar {product.salePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p>
                  {product.category} - {product.subcategory}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Region</p>
                <p>{product.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <Link
                  href={`/seller/${product.sellerId}`}
                  className="text-green-600 hover:underline"
                >
                  {product.seller}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p className="text-green-600">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Variety Selection */}
            {product.varieties && product.varieties.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variety
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.varieties.map((variety, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      className={
                        index === 0 ? "bg-green-600 hover:bg-green-700" : ""
                      }
                    >
                      {variety}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <Button variant="outline" size="icon">
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  defaultValue="1"
                  className="w-16 mx-2 px-3 py-2 border rounded-md text-center"
                />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-4 text-sm text-gray-500">
                  {product.weight}kg per item
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-6">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                Buy Now
              </Button>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-gray-500 mr-2" />
                <span>Free shipping on orders over Ar 100,000</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-gray-500 mr-2" />
                <span>Quality guarantee</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-gray-500 mr-2" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-4 border rounded-b-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <p>{product.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Weight</h4>
                <p>{product.weight} kg</p>
              </div>
              <div>
                <h4 className="font-medium">Dimensions</h4>
                <p>{product.dimensions}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attributes" className="p-4 border rounded-b-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Attributes</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h4>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4 border rounded-b-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6"
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {product.rating} out of 5
              </span>
            </div>

            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{review.user}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="p-4 border rounded-b-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            <p>We offer various shipping options to meet your needs:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Standard Shipping (3-5 business days): Ar 10,000</li>
              <li>Express Shipping (1-2 business days): Ar 20,000</li>
              <li>Free shipping on orders over Ar 100,000</li>
            </ul>
            <p>
              Please note that delivery times may vary depending on your
              location.
            </p>

            <h3 className="text-lg font-semibold mt-6">Return Policy</h3>
            <p>
              We accept returns within 30 days of delivery under the following
              conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be unused and in original packaging</li>
              <li>
                Perishable goods cannot be returned unless damaged or defective
              </li>
              <li>
                Return shipping costs are the responsibility of the buyer unless
                the item is defective
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.relatedProducts.map((relProduct) => (
            <Link key={relProduct.id} href={`/product/${relProduct.id}`}>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={relProduct.image || "/placeholder.svg"}
                    alt={relProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{relProduct.name}</h3>
                  <div className="flex items-center my-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3"
                          fill={
                            i < Math.floor(relProduct.rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      {relProduct.rating}
                    </span>
                  </div>
                  <p className="font-bold">
                    Ar {relProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
