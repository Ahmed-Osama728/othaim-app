import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="relative aspect-square bg-muted p-4">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}
