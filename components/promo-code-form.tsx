"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applyPromoCode, removePromoCode } from "@/lib/actions/cart"
import { useNotification } from "@/components/notification-provider"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import type { AppliedPromotion } from "@/lib/types"

interface PromoCodeFormProps {
  appliedPromotions?: AppliedPromotion[]
  currency: string
}

export default function PromoCodeForm({ appliedPromotions = [], currency }: PromoCodeFormProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const { addNotification } = useNotification()
  const router = useRouter()

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      addNotification({
        title: "Erreur",
        message: "Veuillez entrer un code promo",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("code", code)

      const result = await applyPromoCode(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Code promo appliqué",
          message: "Le code promo a été appliqué avec succès",
          type: "success",
        })
        setCode("")
        router.refresh()
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de l'application du code promo",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePromo = async (promoId: string) => {
    setIsRemoving(promoId)
    try {
      const formData = new FormData()
      formData.append("promoId", promoId)

      const result = await removePromoCode(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Code promo retiré",
          message: "Le code promo a été retiré avec succès",
          type: "success",
        })
        router.refresh()
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors du retrait du code promo",
        type: "error",
      })
    } finally {
      setIsRemoving(null)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleApplyCode} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Code promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "..." : "Appliquer"}
        </Button>
      </form>

      {appliedPromotions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Promotions appliquées</p>
          {appliedPromotions.map((promo) => (
            <div key={promo.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
              <div>
                <p className="font-medium text-sm">{promo.name}</p>
                <p className="text-sm text-green-700">
                  -{promo.discountAmount.toLocaleString()} {currency}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePromo(promo.id)}
                className="h-8 w-8 p-0"
                disabled={isRemoving === promo.id}
              >
                {isRemoving === promo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
