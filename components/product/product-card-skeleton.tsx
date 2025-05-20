import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-muted p-4">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
          <Skeleton className="h-4 w-8 ml-1" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardFooter>
    </Card>
  )
}
