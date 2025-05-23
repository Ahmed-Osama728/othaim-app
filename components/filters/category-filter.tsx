"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category") || undefined

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    // Preserve search query if it exists
    const query = searchParams.get("q")
    if (query) {
      params.set("q", query)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <Card className="shadow-md bg-background/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Categories</CardTitle>
        <CardDescription className="text-sm">Filter products by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            className={cn(
              "justify-start w-full rounded-full transition-all hover:shadow-md h-10",
              !selectedCategory ? "bg-primary text-primary-foreground btn-gradient" : "hover:bg-secondary/80",
            )}
            onClick={() => handleCategoryClick(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "justify-start w-full capitalize rounded-full transition-all hover:shadow-md h-10",
                selectedCategory === category
                  ? `bg-primary text-primary-foreground btn-gradient category-btn-${category.split(" ")[0].toLowerCase()}`
                  : "hover:bg-secondary/80",
              )}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
