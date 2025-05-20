import type { Product } from "./types"

const API_URL = "https://fakestoreapi.com"

// Function to fetch products from the API
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

    // Cache the products
    cacheProducts(products)

    return products
  } catch (error) {
    console.error("Error fetching products:", error)

    // If we're offline, try to get from cache as fallback
    const cachedData = getCachedProducts()
    if (cachedData) {
      return cachedData
    }

    throw error
  }
}

// Function to get product categories
export async function getCategories(): Promise<string[]> {
  try {
    // Check if we have cached categories
    const cachedCategories = getCachedCategories()

    if (cachedCategories) {
      return cachedCategories
    }

    // If no cache, fetch from API
    const response = await fetch(`${API_URL}/products/categories`, {
      next: { revalidate: 86400 }, // Revalidate every day
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const categories = await response.json()

    // Cache the categories
    cacheCategories(categories)

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)

    // If we're offline, try to get from cache as fallback
    const cachedCategories = getCachedCategories()
    if (cachedCategories) {
      return cachedCategories
    }

    // If no cache, return empty array
    return []
  }
}

// Function to get a single product by ID
export async function getProduct(id: number): Promise<Product> {
  try {
    // Check if we have cached products
    const cachedProducts = getCachedProducts()

    if (cachedProducts) {
      const cachedProduct = cachedProducts.find((p) => p.id === id)
      if (cachedProduct) {
        return cachedProduct
      }
    }

    // If no cache or product not in cache, fetch from API
    const response = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

// Function to cache products in localStorage
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

// Function to get cached products from localStorage
function getCachedProducts(): Product[] | null {
  if (typeof window === "undefined") return null

  try {
    const cachedData = localStorage.getItem("cachedProducts")

    if (!cachedData) return null

    const { products, timestamp } = JSON.parse(cachedData)

    // Check if cache is expired (24 hours)
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
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

// Function to cache categories in localStorage
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

// Function to get cached categories from localStorage
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

// Function to sync local data with remote API
export async function syncWithRemoteAPI(): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine) return

  try {
    // Fetch fresh products data
    const productsResponse = await fetch(`${API_URL}/products`)
    if (productsResponse.ok) {
      const products = await productsResponse.json()
      cacheProducts(products)
    }

    // Fetch fresh categories data
    const categoriesResponse = await fetch(`${API_URL}/products/categories`)
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json()
      cacheCategories(categories)
    }

    console.log("Successfully synced with remote API")
  } catch (error) {
    console.error("Error syncing with remote API:", error)
  }
}
