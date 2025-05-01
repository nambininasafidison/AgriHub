"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export type SortOption = "price-asc" | "price-desc" | "newest" | "popular" | "rating"

export type FilterState = {
  query: string
  category: string[]
  minPrice: number | null
  maxPrice: number | null
  inStock: boolean
  rating: number | null
  sort: SortOption
  page: number
}

type SearchContextType = {
  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
  applyFilters: () => void
  isLoading: boolean
}

const initialFilters: FilterState = {
  query: "",
  category: [],
  minPrice: null,
  maxPrice: null,
  inStock: false,
  rating: null,
  sort: "newest",
  page: 1,
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize filters from URL on mount
  useEffect(() => {
    const query = searchParams.get("q") || ""
    const category = searchParams.getAll("category")
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null
    const inStock = searchParams.get("inStock") === "true"
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null
    const sort = (searchParams.get("sort") as SortOption) || "newest"
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1

    setFilters({
      query,
      category,
      minPrice,
      maxPrice,
      inStock,
      rating,
      sort,
      page,
    })
  }, [searchParams])

  // Update a single filter
  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Reset all filters to default
  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // Apply filters by updating URL
  const applyFilters = () => {
    setIsLoading(true)

    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)

    filters.category.forEach((cat) => {
      params.append("category", cat)
    })

    if (filters.minPrice !== null) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice !== null) params.set("maxPrice", filters.maxPrice.toString())
    if (filters.inStock) params.set("inStock", "true")
    if (filters.rating !== null) params.set("rating", filters.rating.toString())
    if (filters.sort !== "newest") params.set("sort", filters.sort)
    if (filters.page !== 1) params.set("page", filters.page.toString())

    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ""}`)

    // Simulate loading state for better UX
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <SearchContext.Provider value={{ filters, setFilter, resetFilters, applyFilters, isLoading }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
