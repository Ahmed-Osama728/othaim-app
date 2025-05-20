import { getProducts } from "@/lib/api"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"
import { notFound } from "next/navigation"

interface ProductListProps {
  searchParams?: { q?: string; category?: string }
}

export default async function ProductList({
  searchParams,
}: ProductListProps = {}) {
  try {
    const products = await getProducts()

    // Filter products based on search query and category
    const filteredProducts = filterProducts(products, searchParams)

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
    console.error("Error loading products:", error)
    notFound()
  }
}

function filterProducts(products: Product[], searchParams?: { q?: string; category?: string }): Product[] {
  if (!searchParams) return products

  let searchQuery: string | undefined;
  let filterCategory: string | undefined;

  if (searchParams) {
    searchQuery = searchParams.q;
    filterCategory = searchParams.category;
  }

  return products.filter((product) => {
    // Filter by search query
    if (
      searchQuery &&
      !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (filterCategory && product.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false
    }

    return true
  })
}
