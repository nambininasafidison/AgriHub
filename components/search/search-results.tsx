import { searchProducts } from "@/lib/actions/search"
import ProductCard from "@/components/product-card"
import type { FilterState } from "@/contexts/search-context"

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Convert search params to filter state
  const filters: FilterState = {
    query: typeof searchParams.q === "string" ? searchParams.q : "",
    category: Array.isArray(searchParams.category)
      ? searchParams.category
      : searchParams.category
        ? [searchParams.category]
        : [],
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : null,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : null,
    inStock: searchParams.inStock === "true",
    rating: searchParams.rating ? Number(searchParams.rating) : null,
    sort: (searchParams.sort as any) || "newest",
    page: searchParams.page ? Number(searchParams.page) : 1,
  }

  const { products, totalProducts } = await searchProducts(filters)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-500">Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {totalProducts} produit{totalProducts !== 1 ? "s" : ""} trouvé{totalProducts !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
