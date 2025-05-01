"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ProductVariation } from "@/lib/types"

interface ProductVariationSelectorProps {
  variations: ProductVariation[]
  onVariationChange: (variationId: string, optionId: string, priceModifier: number) => void
}

export default function ProductVariationSelector({ variations, onVariationChange }: ProductVariationSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  // Initialize with first option of each variation
  useEffect(() => {
    const initialOptions: Record<string, string> = {}
    variations.forEach((variation) => {
      if (variation.options.length > 0) {
        initialOptions[variation.id] = variation.options[0].id
        onVariationChange(variation.id, variation.options[0].id, variation.options[0].priceModifier)
      }
    })
    setSelectedOptions(initialOptions)
  }, [variations, onVariationChange])

  const handleOptionChange = (variationId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationId]: optionId,
    }))

    // Find the selected option to get the price modifier
    const variation = variations.find((v) => v.id === variationId)
    const option = variation?.options.find((o) => o.id === optionId)

    if (variation && option) {
      onVariationChange(variationId, optionId, option.priceModifier)
    }
  }

  return (
    <div className="space-y-6">
      {variations.map((variation) => (
        <div key={variation.id} className="space-y-3">
          <h3 className="font-medium">{variation.name}</h3>
          <RadioGroup
            value={selectedOptions[variation.id]}
            onValueChange={(value) => handleOptionChange(variation.id, value)}
            className="flex flex-wrap gap-3"
          >
            {variation.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                <Label
                  htmlFor={option.id}
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>{option.name}</span>
                  {option.priceModifier !== 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {option.priceModifier > 0 ? "+" : ""}
                      {option.priceModifier.toLocaleString()} Ar
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )
}
