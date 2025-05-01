"use client"

import { useSearch, type SortOption } from "@/contexts/search-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sortOptions = [
  { value: "newest", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "popular", label: "Popularité" },
  { value: "rating", label: "Évaluation" },
]

export default function SearchSort() {
  const { filters, setFilter, applyFilters } = useSearch()

  const handleSortChange = (value: string) => {
    setFilter("sort", value as SortOption)
    applyFilters()
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Trier par:</span>
      <Select value={filters.sort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
