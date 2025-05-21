import { Suspense } from "react"
import ProductListSkeleton from "@/components/product/product-list-skeleton"
import CategoryFilter from "@/components/filters/category-filter"
import SearchBar from "@/components/filters/search-bar"
import { getCategories, getProducts } from "@/lib/api"
import type { Metadata } from "next"
import ProductListClient from "@/components/product/product-list-client"

export const metadata: Metadata = {
  title: "Othaim Market | Browse Products",
  description: "Browse our collection of high-quality products at competitive prices",
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="md:hidden">
              <SearchBar />
            </div>
            <CategoryFilter categories={categories} />
          </div>
        </div>
        <div className="flex-1">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductListClient products={products} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
