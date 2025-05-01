"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingBag, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product, ProductVariation } from "@/lib/types"
import { addToCart } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"
import { useNotification } from "@/components/notification-provider"
import { useWishlist } from "@/components/wishlist/wishlist-provider"
import ProductVariations from "@/components/product-variations"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AddToCartFormProps {
  product: Product
  selectedVariety?: string
}

export default function AddToCartForm({ product, selectedVariety }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter()
  const { addNotification } = useNotification()
  const { addItem, isInWishlist } = useWishlist()

  const hasVariations = product.variations && product.variations.length > 0
  const hasAttributes = product.attributes && product.attributes.length > 0

  const maxStock = selectedVariation ? selectedVariation.stock : product.stock
  const currentPrice = selectedVariation
    ? selectedVariation.salePrice || selectedVariation.price
    : product.salePrice || product.price

  const productIsInWishlist = isInWishlist(product.id)

  useEffect(() => {
    // Reset quantity when variation changes
    setQuantity(1)
  }, [selectedVariation])

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxStock) {
      setQuantity(value)
    }
  }

  const handleVariationChange = (variation: ProductVariation | null) => {
    setSelectedVariation(variation)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("productId", product.id)
      formData.append("name", product.name)
      formData.append("price", currentPrice.toString())
      formData.append("quantity", quantity.toString())
      formData.append("image", product.image)
      formData.append("weight", product.weight?.toString() || "0.5")

      if (selectedVariety) {
        formData.append("variety", selectedVariety)
      }

      if (selectedVariation) {
        formData.append("variationId", selectedVariation.id)
        formData.append("variationName", selectedVariation.name)
      }

      const result = await addToCart(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        // Show success animation
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 1500)

        addNotification({
          title: "Produit ajouté",
          message: `${product.name} a été ajouté à votre panier`,
          type: "success",
        })
        router.refresh()
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de l'ajout au panier",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddingToWishlist(true)
    try {
      await addItem(product.id, product.name)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hasVariations && hasAttributes && (
        <ProductVariations
          variations={product.variations!}
          attributes={product.attributes!}
          onVariationChange={handleVariationChange}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            type="button"
            className="px-3 py-2 border-r"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isLoading}
          >
            -
          </button>
          <Input
            type="number"
            min="1"
            max={maxStock}
            value={quantity}
            onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
            className="w-16 text-center py-2 border-0 focus:ring-0"
          />
          <button
            type="button"
            className="px-3 py-2 border-l"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxStock || isLoading}
          >
            +
          </button>
        </div>
        <Button
          type="submit"
          className="flex-1 gap-2 relative overflow-hidden"
          disabled={isLoading || maxStock <= 0 || (hasVariations && !selectedVariation)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Ajouter au panier
            </>
          )}

          {addedToCart && (
            <motion.div
              className="absolute inset-0 bg-green-600 flex items-center justify-center"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              ✓ Ajouté!
            </motion.div>
          )}
        </Button>
        <Button
          type="button"
          variant={productIsInWishlist ? "default" : "outline"}
          size="icon"
          className={cn("rounded-full", {
            "bg-red-500 hover:bg-red-600": productIsInWishlist,
          })}
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
        >
          {isAddingToWishlist ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={cn("h-5 w-5", { "fill-white text-white": productIsInWishlist })} />
          )}
          <span className="sr-only">{productIsInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
        </Button>
      </div>

      {maxStock <= 0 && <p className="text-red-500 text-sm">Ce produit est actuellement en rupture de stock.</p>}

      {hasVariations && !selectedVariation && (
        <p className="text-amber-500 text-sm">Veuillez sélectionner une variante du produit.</p>
      )}
    </form>
  )
}
