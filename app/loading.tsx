import ProductListSkeleton from "@/components/product/product-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
        <div className="flex-1">
          <Skeleton className="h-10 w-48 mb-6" />
          <ProductListSkeleton />
        </div>
      </div>
    </main>
  )
}
