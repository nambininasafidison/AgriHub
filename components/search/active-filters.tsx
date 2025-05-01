"use client";

import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/contexts/search-context";
import { X } from "lucide-react";

const categoryMap = {
  seeds: "Semences",
  fertilizers: "Engrais",
  pesticides: "Pesticides",
  tools: "Outils",
  irrigation: "Irrigation",
  machinery: "Machines",
};

export default function ActiveFilters() {
  const { filters, setFilter, applyFilters } = useSearch();

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.inStock ||
    filters.rating !== null;

  if (!hasActiveFilters) return null;

  const removeCategory = (category: string) => {
    setFilter(
      "category",
      filters.category.filter((c) => c !== category)
    );
    applyFilters();
  };

  const removePriceFilter = () => {
    setFilter("minPrice", null);
    setFilter("maxPrice", null);
    applyFilters();
  };

  const removeRatingFilter = () => {
    setFilter("rating", null);
    applyFilters();
  };

  const removeInStockFilter = () => {
    setFilter("inStock", false);
    applyFilters();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm font-medium py-1">Filtres actifs:</span>

      {filters.category.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {categoryMap[category as keyof typeof categoryMap] || category}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => removeCategory(category)}
          />
        </Badge>
      ))}

      {(filters.minPrice !== null || filters.maxPrice !== null) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Prix: {filters.minPrice?.toLocaleString() || 0} -{" "}
          {filters.maxPrice?.toLocaleString() || "∞"} Ar
          <X className="h-3 w-3 cursor-pointer" onClick={removePriceFilter} />
        </Badge>
      )}

      {filters.rating !== null && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {filters.rating}+ étoiles
          <X className="h-3 w-3 cursor-pointer" onClick={removeRatingFilter} />
        </Badge>
      )}

      {filters.inStock && (
        <Badge variant="secondary" className="flex items-center gap-1">
          En stock uniquement
          <X className="h-3 w-3 cursor-pointer" onClick={removeInStockFilter} />
        </Badge>
      )}
    </div>
  );
}
