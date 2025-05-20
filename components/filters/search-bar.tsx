"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize search query from URL
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    } else {
      params.delete("q")
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit" variant="ghost" className="ml-2">
        Search
      </Button>
    </form>
  )
}
