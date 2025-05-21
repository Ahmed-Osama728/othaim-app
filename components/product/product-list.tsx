import { getProducts } from "@/lib/api"
import ProductCard from "./product-card"
import { notFound } from "next/navigation"
import type { Product } from "@/lib/types"

interface ProductListProps {
  params?: {
    q?: string
    category?: string
  }
}

export default async function ProductList({ params }: ProductListProps = {}) {
  try {
    const products = await getProducts()

    // Filter products based on params
    const filteredProducts = filterProducts(products, params)

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both",
            }}
            className="animate-fadeIn"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    )
  } catch (error) {
    notFound()
  }
}

// Helper function to filter products
function filterProducts(products: Product[], params?: { q?: string; category?: string }): Product[] {
  if (!params) return products

  return products.filter((product) => {
    // Filter by search query
    if (
      params.q &&
      !product.title.toLowerCase().includes(params.q.toLowerCase()) &&
      !product.description.toLowerCase().includes(params.q.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (params.category && product.category.toLowerCase() !== params.category.toLowerCase()) {
      return false
    }

    return true
  })
}
