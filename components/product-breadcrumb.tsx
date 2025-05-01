import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductBreadcrumbProps {
  product: Product
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="hover:text-gray-900">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
        </li>
        <li className="flex items-center">
          <Link href="/products" className="hover:text-gray-900">
            Produits
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
        </li>
        {product.category && (
          <li className="flex items-center">
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-gray-900">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </li>
        )}
        {product.subcategory && (
          <li className="flex items-center">
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(
                product.subcategory,
              )}`}
              className="hover:text-gray-900"
            >
              {product.subcategory}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </li>
        )}
        <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
      </ol>
    </nav>
  )
}
