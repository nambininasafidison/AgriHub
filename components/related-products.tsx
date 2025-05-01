import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  products: Product[]
  currentProductId: string
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out the current product
  const filteredProducts = products.filter((product) => product.id !== currentProductId)

  if (filteredProducts.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            salePrice={product.salePrice}
            region={product.region}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isNew={product.isNew}
            onSale={product.onSale}
          />
        ))}
      </div>
    </section>
  )
}
