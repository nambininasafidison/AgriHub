"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/actions/wishlist"
import { useNotification } from "@/components/notification-provider"

interface WishlistContextType {
  wishlistItems: string[]
  isInWishlist: (productId: string) => boolean
  toggleWishlistItem: (productId: string) => Promise<void>
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addNotification } = useNotification()

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setLoading(true)
          const items = await getWishlist()
          setWishlistItems(items)
        } catch (error) {
          console.error("Failed to fetch wishlist:", error)
          addNotification({
            type: "error",
            message: "Failed to load your wishlist. Please try again later.",
          })
        } finally {
          setLoading(false)
        }
      } else {
        // If user is not logged in, try to get wishlist from localStorage
        if (typeof window !== "undefined") {
          const storedWishlist = localStorage.getItem("guestWishlist")
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist))
          }
        }
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user, addNotification])

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  const toggleWishlistItem = async (productId: string) => {
    try {
      if (user) {
        if (isInWishlist(productId)) {
          await removeFromWishlist(productId)
          setWishlistItems((prev) => prev.filter((id) => id !== productId))
          addNotification({
            type: "success",
            message: "Product removed from wishlist",
          })
        } else {
          await addToWishlist(productId)
          setWishlistItems((prev) => [...prev, productId])
          addNotification({
            type: "success",
            message: "Product added to wishlist",
          })
        }
      } else {
        // Handle guest wishlist with localStorage
        if (typeof window !== "undefined") {
          if (isInWishlist(productId)) {
            const updated = wishlistItems.filter((id) => id !== productId)
            setWishlistItems(updated)
            localStorage.setItem("guestWishlist", JSON.stringify(updated))
            addNotification({
              type: "success",
              message: "Product removed from wishlist",
            })
          } else {
            const updated = [...wishlistItems, productId]
            setWishlistItems(updated)
            localStorage.setItem("guestWishlist", JSON.stringify(updated))
            addNotification({
              type: "success",
              message: "Product added to wishlist",
            })
          }
        }
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error)
      addNotification({
        type: "error",
        message: "Failed to update wishlist. Please try again.",
      })
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlistItem, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}
