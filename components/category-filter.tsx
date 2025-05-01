"use client"

import { useState } from "react"
import { Check } from "lucide-react"

const categories = [
  { id: "legumes", name: "Légumes" },
  { id: "fruits", name: "Fruits" },
  { id: "cereales", name: "Céréales" },
  { id: "semences", name: "Semences" },
  { id: "engrais", name: "Engrais" },
  { id: "outils", name: "Outils agricoles" },
]

export default function CategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className={`flex items-center justify-between w-full p-2 rounded-md text-left ${
            selectedCategories.includes(category.id) ? "bg-green-50 text-green-700" : "hover:bg-gray-50"
          }`}
        >
          <span>{category.name}</span>
          {selectedCategories.includes(category.id) && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  )
}
