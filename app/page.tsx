import ProductList from "@/components/product/product-list"
import { Suspense } from "react"
import ProductListSkeleton from "@/components/product/product-list-skeleton"
import CategoryFilter from "@/components/filters/category-filter"
import SearchBar from "@/components/filters/search-bar"
import { getCategories } from "@/lib/api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Elegance Market | Browse Products",
  description: "Browse our collection of high-quality products at competitive prices",
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string }
}) {
  let q: string | undefined;
  let category: string | undefined;

  if (searchParams) {
    q = searchParams.q;
    category = searchParams.category;
  }

  const categories = await getCategories()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="md:hidden">
              <SearchBar />
            </div>
            <CategoryFilter categories={categories} selectedCategory={category} />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">
            {category
              ? `${category!.charAt(0).toUpperCase() + category!.slice(1)}`
              : "All Products"}
          </h1>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList searchParams={{ q, category }} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
