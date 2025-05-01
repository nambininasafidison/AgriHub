import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, TrendingUp, Users, ShieldCheck, Truck, CreditCard } from "lucide-react"

export default function HomePage() {
  // Featured categories
  const categories = [
    { name: "Fruits & Vegetables", image: "/placeholder.svg?height=200&width=200" },
    { name: "Grains & Cereals", image: "/placeholder.svg?height=200&width=200" },
    { name: "Spices", image: "/placeholder.svg?height=200&width=200" },
    { name: "Seeds & Seedlings", image: "/placeholder.svg?height=200&width=200" },
    { name: "Dairy Products", image: "/placeholder.svg?height=200&width=200" },
    { name: "Farm Equipment", image: "/placeholder.svg?height=200&width=200" },
  ]

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Vanilla",
      price: 150000,
      image: "/placeholder.svg?height=300&width=300",
      seller: "Rakoto Jean",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Arabica Coffee",
      price: 50000,
      image: "/placeholder.svg?height=300&width=300",
      seller: "Rasoa Marie",
      rating: 4.2,
    },
    {
      id: 3,
      name: "Organic Rice",
      price: 25000,
      image: "/placeholder.svg?height=300&width=300",
      seller: "Randria Paul",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Fresh Litchis",
      price: 15000,
      image: "/placeholder.svg?height=300&width=300",
      seller: "Rakoto Jean",
      rating: 4.3,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresh Agricultural Products Direct from Farmers</h1>
              <p className="text-lg mb-6">
                Connect with local farmers and suppliers for the freshest produce and agricultural products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Link href="/marketplace">Shop Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                  <Link href="/sell">Sell Products</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Fresh agricultural products"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={index} href={`/marketplace?category=${encodeURIComponent(category.name)}`} className="group">
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-40">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/marketplace">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">Sold by {product.seller}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.floor(product.rating) ? "★" : i < product.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg">Ar {product.price.toLocaleString()}</p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgriCommerce Hub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-gray-600">Direct from farms to your doorstep, ensuring freshness and quality.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Local Farmers</h3>
              <p className="text-gray-600">Your purchase directly supports local agricultural communities.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Transparent pricing that benefits both farmers and consumers.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products are verified for quality and authenticity.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Efficient logistics to deliver your orders promptly.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple secure payment options for your convenience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Agricultural Marketplace?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to sell your produce or a buyer seeking quality agricultural products,
            AgriCommerce Hub is the platform for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
