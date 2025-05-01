"use client"

import { useState } from "react"
import { useSearch } from "@/contexts/search-context"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, X, ChevronDown, ChevronUp, Star } from "lucide-react"

// Mock categories for demonstration
const categories = [
  { id: "seeds", name: "Semences" },
  { id: "fertilizers", name: "Engrais" },
  { id: "pesticides", name: "Pesticides" },
  { id: "tools", name: "Outils" },
  { id: "irrigation", name: "Irrigation" },
  { id: "machinery", name: "Machines" },
]

export default function SearchFilters() {
  const { filters, setFilter, resetFilters, applyFilters } = useSearch()
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
  })

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setFilter("category", [...filters.category, categoryId])
    } else {
      setFilter(
        "category",
        filters.category.filter((id) => id !== categoryId),
      )
    }
  }

  const handlePriceChange = (value: number[]) => {
    setFilter("minPrice", value[0])
    setFilter("maxPrice", value[1])
  }

  const handleRatingChange = (rating: number) => {
    setFilter("rating", filters.rating === rating ? null : rating)
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-900">
          <X className="h-4 w-4 mr-1" />
          Réinitialiser
        </Button>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("categories")}>
          <h3 className="font-medium">Catégories</h3>
          {expanded.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {expanded.categories && (
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("price")}>
          <h3 className="font-medium">Prix (Ar)</h3>
          {expanded.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {expanded.price && (
          <div className="mt-4 px-2">
            <div className="mb-6">
              <Slider
                defaultValue={[0, 100000]}
                min={0}
                max={100000}
                step={1000}
                value={[
                  filters.minPrice !== null ? filters.minPrice : 0,
                  filters.maxPrice !== null ? filters.maxPrice : 100000,
                ]}
                onValueChange={handlePriceChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="min-price" className="text-xs text-gray-500">
                  Min
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  className="h-8 w-24"
                  value={filters.minPrice !== null ? filters.minPrice : ""}
                  onChange={(e) => setFilter("minPrice", e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-xs text-gray-500">
                  Max
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  className="h-8 w-24"
                  value={filters.maxPrice !== null ? filters.maxPrice : ""}
                  onChange={(e) => setFilter("maxPrice", e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("rating")}>
          <h3 className="font-medium">Évaluation</h3>
          {expanded.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {expanded.rating && (
          <div className="mt-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => handleRatingChange(rating)}
              >
                <div
                  className={`p-1 rounded ${filters.rating === rating ? "bg-yellow-50 border border-yellow-200" : ""}`}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm">et plus</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("availability")}>
          <h3 className="font-medium">Disponibilité</h3>
          {expanded.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {expanded.availability && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => setFilter("inStock", checked as boolean)}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                En stock uniquement
              </Label>
            </div>
          </div>
        )}
      </div>

      <Button className="w-full" onClick={applyFilters}>
        Appliquer les filtres
      </Button>
    </div>
  )
}
