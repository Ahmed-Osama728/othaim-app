"use client"

import { useSearchParams } from "next/navigation"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"
import { useEffect, useState } from "react"

interface ProductListClientProps {
  products: Product[]
}

export default function ProductListClient({ products }: ProductListClientProps) {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const q = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""

  const title = category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"

  useEffect(() => {
    const filtered = products.filter((product) => {
      if (
        q &&
        !product.title.toLowerCase().includes(q.toLowerCase()) &&
        !product.description.toLowerCase().includes(q.toLowerCase())
      ) {
        return false
      }

      if (category && product.category.toLowerCase() !== category.toLowerCase()) {
        return false
      }

      return true
    })

    setFilteredProducts(filtered)
  }, [products, q, category])

  if (filteredProducts.length === 0) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
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
    </>
  )
}
