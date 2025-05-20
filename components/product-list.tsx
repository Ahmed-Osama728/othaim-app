import { getProducts } from "@/lib/api"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"
import { Suspense } from "react"
import ProductCardSkeleton from "./product-card-skeleton"
import { notFound } from "next/navigation"

interface ProductListProps {
  searchParams?: { q?: string; category?: string }
}

export default async function ProductList({ searchParams }: ProductListProps = {}) {
  try {
    const products = await getProducts()

    // Filter products based on search query
    const filteredProducts = filterProducts(products, searchParams)

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
            <ProductCard product={product} />
          </Suspense>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error loading products:", error)
    notFound()
  }
}

function filterProducts(products: Product[], searchParams?: { q?: string; category?: string }): Product[] {
  if (!searchParams) return products

  return products.filter((product) => {
    // Filter by search query
    if (
      searchParams.q &&
      !product.title.toLowerCase().includes(searchParams.q.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchParams.q.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (searchParams.category && product.category.toLowerCase() !== searchParams.category.toLowerCase()) {
      return false
    }

    return true
  })
}
