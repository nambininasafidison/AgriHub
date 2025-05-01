"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCart } from "@/lib/actions/cart"
import type { Cart } from "@/lib/types"

type CartContextType = {
  cart: Cart
  isLoading: boolean
  refreshCart: () => Promise<void>
  cartItemCount: number
  cartSubtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = async () => {
    setIsLoading(true)
    try {
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cart.subtotal

  return (
    <CartContext.Provider value={{ cart, isLoading, refreshCart, cartItemCount, cartSubtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
