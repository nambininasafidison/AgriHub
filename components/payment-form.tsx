"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone } from "lucide-react"

interface PaymentFormProps {
  total: number
  onSuccess: (paymentMethod: string) => void
  isLoading?: boolean
}

export default function PaymentForm({ total, onSuccess, isLoading = false }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("mvola")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phoneNumber) {
      setError("Veuillez saisir votre numéro de téléphone")
      return
    }

    // Validate phone number based on payment method
    let phoneRegex
    if (paymentMethod === "mvola") {
      phoneRegex = /^03[4]\d{7}$/
    } else if (paymentMethod === "airtel") {
      phoneRegex = /^03[2]\d{7}$/
    } else if (paymentMethod === "orange") {
      phoneRegex = /^03[3]\d{7}$/
    } else {
      phoneRegex = /^03[2-4,9]\d{7}$/
    }

    if (!phoneRegex.test(phoneNumber)) {
      setError(`Numéro de téléphone invalide pour ${paymentMethod.toUpperCase()}. Format attendu: 03X XX XXX XX`)
      return
    }

    setIsProcessing(true)

    try {
      // Simuler l'appel à l'API de paiement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Appeler le callback de succès
      onSuccess(paymentMethod)
    } catch (err) {
      setError("Une erreur s'est produite lors du traitement du paiement. Veuillez réessayer.")
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
        <CardDescription>Choisissez votre méthode de paiement préférée</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="mvola" id="mvola" className="peer sr-only" />
                <Label
                  htmlFor="mvola"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="h-10 w-10 mb-2 text-orange-500" />
                  <span className="text-sm font-medium">MVola</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="airtel" id="airtel" className="peer sr-only" />
                <Label
                  htmlFor="airtel"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="h-10 w-10 mb-2 text-red-500" />
                  <span className="text-sm font-medium">Airtel Money</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="orange" id="orange" className="peer sr-only" />
                <Label
                  htmlFor="orange"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="h-10 w-10 mb-2 text-orange-600" />
                  <span className="text-sm font-medium">Orange Money</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={
                  paymentMethod === "mvola"
                    ? "034 XX XXX XX"
                    : paymentMethod === "airtel"
                      ? "032 XX XXX XX"
                      : "033 XX XXX XX"
                }
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Entrez le numéro associé à votre compte{" "}
                {paymentMethod === "mvola" ? "MVola" : paymentMethod === "airtel" ? "Airtel Money" : "Orange Money"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Total à payer</span>
                <span className="font-bold">{total.toLocaleString()} Ar</span>
              </div>
              <p className="text-xs text-gray-500">
                Vous recevrez un SMS pour confirmer le paiement sur votre téléphone.
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isProcessing || isLoading}>
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${total.toLocaleString()} Ar`
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-xs text-center text-gray-500">
          Vos informations de paiement sont sécurisées. Nous ne stockons pas vos données de paiement.
        </p>
      </CardFooter>
    </Card>
  )
}
