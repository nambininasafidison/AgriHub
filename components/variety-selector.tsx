"use client"

import { useState } from "react"

interface VarietySelectorProps {
  varieties: string[]
  onSelect?: (variety: string) => void
}

export default function VarietySelector({ varieties, onSelect }: VarietySelectorProps) {
  const [selectedVariety, setSelectedVariety] = useState<string | null>(varieties[0] || null)

  const handleSelect = (variety: string) => {
    setSelectedVariety(variety)
    if (onSelect) {
      onSelect(variety)
    }
  }

  // Map varieties to colors
  const getColorForVariety = (variety: string) => {
    const colorMap: Record<string, string> = {
      Premium: "bg-blue-500",
      Standard: "bg-green-500",
      Export: "bg-red-500",
      Biologique: "bg-green-600",
      Local: "bg-teal-500",
    }

    return colorMap[variety] || "bg-gray-500"
  }

  return (
    <div className="flex space-x-4">
      {varieties.map((variety) => (
        <button
          key={variety}
          onClick={() => handleSelect(variety)}
          className={`w-8 h-8 rounded-full ${getColorForVariety(variety)} ${
            selectedVariety === variety ? "ring-2 ring-offset-2 ring-gray-300" : ""
          }`}
          aria-label={`Select ${variety} variety`}
          title={variety}
        />
      ))}
    </div>
  )
}
