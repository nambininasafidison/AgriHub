"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Minus, Plus, RefreshCw, ShoppingBag } from "lucide-react"

export default function CartPage() {
  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Vanilla",
      price: 150000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
      seller: "Rakoto Jean",
      variety: "Grade A",
      weight: 0.1,
    },
    {
      id: 2,
      name: "Arabica Coffee",
      price: 50000,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
      seller: "Rasoa Marie",
      variety: null,
      weight: 0.25,
    },
  ])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal > 100000 ? 0 : 10000
  const taxRate = 0.08
  const taxAmount = subtotal * taxRate
  const total = subtotal + shippingCost + taxAmount

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row border-b pb-6">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 sm:ml-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              <Link href={`/product/${item.id}`} className="hover:text-green-600">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="text-gray-500 text-sm">Sold by {item.seller}</p>
                          </div>
                          <p className="font-bold text-lg mt-2 sm:mt-0">Ar {item.price.toLocaleString()}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="space-y-1 mb-3 sm:mb-0">
                            {item.variety && <p className="text-sm">Variety: {item.variety}</p>}
                            <p className="text-sm text-gray-500">Weight: {item.weight}kg per item</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                className="w-12 mx-2 px-2 py-1 border rounded-md text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Update Cart
                  </Button>
                  <Button asChild variant="outline" className="flex items-center gap-2">
                    <Link href="/marketplace">
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Ar {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `Ar ${shippingCost.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>Ar {taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>Ar {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">We Accept</h3>
                  <div className="flex gap-2">
                    <div className="bg-gray-100 rounded p-2 text-xs">Credit Card</div>
                    <div className="bg-gray-100 rounded p-2 text-xs">Mobile Money</div>
                    <div className="bg-gray-100 rounded p-2 text-xs">Bank Transfer</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>Free shipping on orders over Ar 100,000</p>
                  <p>30-day return policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/marketplace">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
