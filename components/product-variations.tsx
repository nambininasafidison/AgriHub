"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { ProductVariation, ProductAttribute } from "@/lib/types"

interface ProductVariationsProps {
  variations: ProductVariation[]
  attributes: ProductAttribute[]
  onVariationChange: (variation: ProductVariation | null) => void
  initialVariationId?: string
}

export default function ProductVariations({
  variations,
  attributes,
  onVariationChange,
  initialVariationId,
}: ProductVariationsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [availableAttributeValues, setAvailableAttributeValues] = useState<Record<string, string[]>>({})
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)

  // Initialize with all possible attribute values
  useEffect(() => {
    const attributeValues: Record<string, string[]> = {}

    // Initialize with all attribute values from the product
    attributes.forEach((attribute) => {
      attributeValues[attribute.name] = attribute.values
    })

    setAvailableAttributeValues(attributeValues)

    // If initialVariationId is provided, select that variation
    if (initialVariationId) {
      const variation = variations.find((v) => v.id === initialVariationId)
      if (variation) {
        setSelectedAttributes(variation.attributes)
        setSelectedVariation(variation)
        onVariationChange(variation)
      }
    }
  }, [variations, attributes, initialVariationId, onVariationChange])

  // Update available attribute values based on current selection
  useEffect(() => {
    // Skip if no attributes are selected yet
    if (Object.keys(selectedAttributes).length === 0) return

    const newAvailableValues: Record<string, string[]> = {}

    // For each attribute
    attributes.forEach((attribute) => {
      const attributeName = attribute.name

      // If this attribute is already selected, keep only that value
      if (selectedAttributes[attributeName]) {
        newAvailableValues[attributeName] = [selectedAttributes[attributeName]]
        return
      }

      // Otherwise, find all possible values for this attribute based on current selections
      const possibleValues = new Set<string>()

      variations.forEach((variation) => {
        // Check if this variation matches all currently selected attributes
        const isMatch = Object.entries(selectedAttributes).every(([key, value]) => variation.attributes[key] === value)

        if (isMatch) {
          possibleValues.add(variation.attributes[attributeName])
        }
      })

      newAvailableValues[attributeName] = Array.from(possibleValues)
    })

    setAvailableAttributeValues(newAvailableValues)

    // Find the matching variation based on selected attributes
    const matchingVariation = variations.find(
      (variation) =>
        Object.entries(selectedAttributes).every(([key, value]) => variation.attributes[key] === value) &&
        Object.keys(variation.attributes).length === Object.keys(selectedAttributes).length,
    )

    setSelectedVariation(matchingVariation || null)
    onVariationChange(matchingVariation || null)
  }, [selectedAttributes, variations, attributes, onVariationChange])

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }))
  }

  const renderAttributeSelector = (attribute: ProductAttribute) => {
    const values = availableAttributeValues[attribute.name] || []

    if (values.length === 0) return null

    // For color attributes, show color swatches
    if (attribute.name.toLowerCase() === "couleur" || attribute.name.toLowerCase() === "color") {
      return (
        <div key={attribute.name} className="space-y-2">
          <Label>{attribute.name}</Label>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attribute.name] === value
              const colorClass = getColorClass(value)

              return (
                <button
                  key={value}
                  type="button"
                  className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center ${
                    isSelected ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  onClick={() => handleAttributeChange(attribute.name, value)}
                  aria-label={`${attribute.name}: ${value}`}
                >
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    // For size attributes, show buttons
    if (attribute.name.toLowerCase() === "taille" || attribute.name.toLowerCase() === "size") {
      return (
        <div key={attribute.name} className="space-y-2">
          <Label>{attribute.name}</Label>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attribute.name] === value

              return (
                <Button
                  key={value}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className="min-w-[40px]"
                  onClick={() => handleAttributeChange(attribute.name, value)}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
      )
    }

    // For other attributes, use radio buttons
    return (
      <div key={attribute.name} className="space-y-2">
        <Label>{attribute.name}</Label>
        <RadioGroup
          value={selectedAttributes[attribute.name] || ""}
          onValueChange={(value) => handleAttributeChange(attribute.name, value)}
        >
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${attribute.name}-${value}`} />
                <Label htmlFor={`${attribute.name}-${value}`}>{value}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    )
  }

  // Helper function to get Tailwind color class from color name
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      rouge: "bg-red-500",
      red: "bg-red-500",
      bleu: "bg-blue-500",
      blue: "bg-blue-500",
      vert: "bg-green-500",
      green: "bg-green-500",
      jaune: "bg-yellow-500",
      yellow: "bg-yellow-500",
      noir: "bg-black",
      black: "bg-black",
      blanc: "bg-white border border-gray-300",
      white: "bg-white border border-gray-300",
      gris: "bg-gray-500",
      gray: "bg-gray-500",
      orange: "bg-orange-500",
      violet: "bg-purple-500",
      purple: "bg-purple-500",
      rose: "bg-pink-500",
      pink: "bg-pink-500",
      marron: "bg-amber-800",
      brown: "bg-amber-800",
      turquoise: "bg-teal-500",
      teal: "bg-teal-500",
    }

    return colorMap[color.toLowerCase()] || "bg-gray-300"
  }

  return (
    <div className="space-y-4">
      {attributes.map(renderAttributeSelector)}

      {selectedVariation && (
        <div className="text-sm text-gray-500">
          SKU: {selectedVariation.sku}
          {selectedVariation.stock <= 5 && (
            <span className="ml-2 text-amber-600">
              {selectedVariation.stock === 0 ? "Rupture de stock" : `Plus que ${selectedVariation.stock} en stock!`}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
