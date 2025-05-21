import type { Product } from "./types"
import { toast } from "@/components/ui/use-toast"

const API_URL = "https://fakestoreapi.com"

export async function getProducts(): Promise<Product[]> {
  try {
    // Check if we have cached products and they're not expired
    const cachedData = getCachedProducts()

    if (cachedData) {
      return cachedData
    }

    // If no cache or expired, fetch from API
    const response = await fetch(`${API_URL}/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const products = await response.json()

    cacheProducts(products)

    return products
  } catch (error) {
    if (typeof window !== "undefined") {
      toast({
        title: "Error loading products",
        description: "Could not load products. Please try again later.",
        variant: "destructive",
      })
    }

    // If we're offline, try to get from cache as fallback
    const cachedData = getCachedProducts()
    if (cachedData) {
      return cachedData
    }

    throw error
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const cachedCategories = getCachedCategories()

    if (cachedCategories) {
      return cachedCategories
    }

    const response = await fetch(`${API_URL}/products/categories`, {
      next: { revalidate: 86400 }, // Revalidate every day
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const categories = await response.json()

    cacheCategories(categories)

    return categories
  } catch (error) {
    if (typeof window !== "undefined") {
      toast({
        title: "Error loading categories",
        description: "Could not load product categories. Please try again later.",
        variant: "destructive",
      })
    }

    const cachedCategories = getCachedCategories()
    if (cachedCategories) {
      return cachedCategories
    }

    return []
  }
}

export async function getProduct(id: number): Promise<Product> {
  try {
    const cachedProducts = getCachedProducts()

    if (cachedProducts) {
      const cachedProduct = cachedProducts.find((p) => p.id === id)
      if (cachedProduct) {
        return cachedProduct
      }
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (typeof window !== "undefined") {
      toast({
        title: "Error loading product",
        description: `Could not load product details for ID: ${id}. Please try again later.`,
        variant: "destructive",
      })
    }

    throw error
  }
}

function cacheProducts(products: Product[]): void {
  if (typeof window === "undefined") return

  try {
    const cacheData = {
      products,
      timestamp: Date.now(),
    }
    localStorage.setItem("cachedProducts", JSON.stringify(cacheData))
  } catch (error) {
    console.error("Error caching products:", error)
  }
}

function getCachedProducts(): Product[] | null {
  if (typeof window === "undefined") return null

  try {
    const cachedData = localStorage.getItem("cachedProducts")

    if (!cachedData) return null

    const { products, timestamp } = JSON.parse(cachedData)

    // Check if cache is expired (24 hours)
    const CACHE_DURATION = 24 * 60 * 60 * 1000 
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem("cachedProducts")
      return null
    }

    return products
  } catch (error) {
    console.error("Error retrieving cached products:", error)
    return null
  }
}

function cacheCategories(categories: string[]): void {
  if (typeof window === "undefined") return

  try {
    const cacheData = {
      categories,
      timestamp: Date.now(),
    }
    localStorage.setItem("cachedCategories", JSON.stringify(cacheData))
  } catch (error) {
    console.error("Error caching categories:", error)
  }
}

function getCachedCategories(): string[] | null {
  if (typeof window === "undefined") return null

  try {
    const cachedData = localStorage.getItem("cachedCategories")

    if (!cachedData) return null

    const { categories, timestamp } = JSON.parse(cachedData)

    // Check if cache is expired (7 days)
    const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem("cachedCategories")
      return null
    }

    return categories
  } catch (error) {
    console.error("Error retrieving cached categories:", error)
    return null
  }
}

export async function syncWithRemoteAPI(): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine) return

  try {
    const productsResponse = await fetch(`${API_URL}/products`)
    if (productsResponse.ok) {
      const products = await productsResponse.json()
      cacheProducts(products)
    } else {
      throw new Error(`Failed to sync products: ${productsResponse.status}`)
    }

    const categoriesResponse = await fetch(`${API_URL}/products/categories`)
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json()
      cacheCategories(categories)
    } else {
      throw new Error(`Failed to sync categories: ${categoriesResponse.status}`)
    }

  } catch (error) {
    toast({
      title: "Sync failed",
      description: "Could not sync with the server. Some data may be outdated.",
      variant: "destructive",
    })
  }
}
