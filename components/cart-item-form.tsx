"use client"

import { useState } from "react"
import type { CartItem } from "@/lib/types"
import { updateCartItem, removeFromCart } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"
import { Input } from "@/components/ui/input"

interface CartItemFormProps {
  item: CartItem
}

export default function CartItemForm({ item }: CartItemFormProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()
  const { addNotification } = useNotification()

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return

    setQuantity(newQuantity)

    // If quantity is 0, we'll handle it in the remove function
    if (newQuantity === 0) {
      return handleRemove()
    }

    await updateItemQuantity(newQuantity)
  }

  const updateItemQuantity = async (newQuantity: number) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("itemId", item.id)
      formData.append("quantity", newQuantity.toString())

      const result = await updateCartItem(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
        // Reset to previous quantity
        setQuantity(item.quantity)
      } else {
        router.refresh()
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue. Veuillez réessayer.",
        type: "error",
      })
      // Reset to previous quantity
      setQuantity(item.quantity)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      const formData = new FormData()
      formData.append("itemId", item.id)

      const result = await removeFromCart(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Article supprimé",
          message: "L'article a été retiré de votre panier",
          type: "success",
        })
        router.refresh()
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue. Veuillez réessayer.",
        type: "error",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
      <div className="flex items-center border rounded-md">
        <button
          type="button"
          className="px-2 sm:px-3 py-1 sm:py-2 border-r"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={isLoading || quantity <= 1}
        >
          -
        </button>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
          className="w-10 sm:w-12 text-center py-1 sm:py-2 border-0 focus:ring-0"
          disabled={isLoading}
        />
        <button
          type="button"
          className="px-2 sm:px-3 py-1 sm:py-2 border-l"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isLoading}
        >
          +
        </button>
      </div>
      <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isRemoving || isLoading}>
        {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
      </Button>
    </div>
  )
}
