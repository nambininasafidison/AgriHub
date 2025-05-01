import type { Product } from "@/lib/types"

interface ProductSpecificationsProps {
  product: Product
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specifications = [
    { name: "Catégorie", value: product.category },
    { name: "Sous-catégorie", value: product.subcategory },
    { name: "Région", value: product.region },
    { name: "Vendeur", value: product.seller },
    { name: "Poids", value: product.weight ? `${product.weight} kg` : "Non spécifié" },
  ]

  if (product.dimensions) {
    specifications.push({
      name: "Dimensions",
      value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`,
    })
  }

  if (product.sku) {
    specifications.push({ name: "SKU", value: product.sku })
  }

  return (
    <div className="space-y-4">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200">
          {specifications.map(
            (spec) =>
              spec.value && (
                <tr key={spec.name}>
                  <td className="py-3 text-sm font-medium text-gray-500 w-1/3">{spec.name}</td>
                  <td className="py-3 text-sm text-gray-900">{spec.value}</td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </div>
  )
}
