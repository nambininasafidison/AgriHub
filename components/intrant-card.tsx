import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface IntrantCardProps {
  intrant: {
    id: string
    name: string
    category: string
    subcategory: string
    price: number
    unit: string
    rating: number
    reviewCount: number
    image: string
    supplier: string
    inStock: boolean
  }
}

export default function IntrantCard({ intrant }: IntrantCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Link href={`/intrants/${intrant.id}`}>
        <div className="bg-[#f5f5f7] p-4 flex items-center justify-center h-48">
          <img
            src={intrant.image || "/placeholder.svg"}
            alt={intrant.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {intrant.category}
          </Badge>
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs ml-1">{intrant.rating}</span>
          </div>
        </div>
        <Link href={`/intrants/${intrant.id}`}>
          <h3 className="font-medium mb-1 hover:text-green-600 transition-colors">{intrant.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">Fournisseur: {intrant.supplier}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold">
            {intrant.price.toLocaleString()} Ar/{intrant.unit}
          </span>
          <Button size="sm" variant="outline" className="rounded-full" disabled={!intrant.inStock}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {!intrant.inStock && <p className="text-xs text-red-500 mt-2">Rupture de stock</p>}
      </div>
    </div>
  )
}
