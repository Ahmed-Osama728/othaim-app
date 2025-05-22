import { getProducts, getCategories, getProduct, syncWithRemoteAPI } from "@/lib/api"
import { beforeEach, describe, expect, it, vi } from "vitest"

global.fetch = vi.fn()

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

Object.defineProperty(navigator, "onLine", {
  writable: true,
  value: true,
})

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}))

import { toast } from "@/hooks/use-toast"

const mockProducts = [
  {
    id: 1,
    title: "Test Product 1",
    price: 99.99,
    description: "Test description 1",
    category: "test",
    image: "test1.jpg",
    rating: {
      rate: 4.5,
      count: 100,
    },
  },
  {
    id: 2,
    title: "Test Product 2",
    price: 49.99,
    description: "Test description 2",
    category: "test2",
    image: "test2.jpg",
    rating: {
      rate: 4.0,
      count: 50,
    },
  },
]

const mockCategories = ["test", "test2", "test3"]

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  global.fetch = vi.fn();
  Object.defineProperty(navigator, "onLine", {
    writable: true,
    value: true,
  });
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();

  // Clear the toast mock spy before each test
  // @ts-ignore
  toast.mockClear();
});

describe("API Functions", () => {
  describe("getProducts", () => {
    it("should fetch products from API when no cache exists", async () => {
      const mockResponse = {
        ok: true,
        json: async () => mockProducts,
      };

      // Ensure no cache exists for this test by explicitly returning null from getItem
      localStorageMock.getItem.mockReturnValue(null);

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const products = await getProducts();

      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products", {
        next: { revalidate: 3600 },
      });
      expect(products).toEqual(mockProducts);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      // setItem called to cache new data, verify its content separately
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedProducts", expect.any(String));
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedProducts");
      if (setItemCall) {
        try {
          const cachedData = JSON.parse(setItemCall[1]);
          expect(cachedData).toHaveProperty('products', mockProducts);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
          throw new Error("Failed to parse cached products JSON");
        }
      }
    });

    it("should return cached products when valid cache exists", async () => {
      const cachedData = {
        products: mockProducts,
        timestamp: Date.now(), 
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const products = await getProducts();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should fetch from API when cache is expired", async () => {
      const cachedData = {
        products: mockProducts,
        timestamp: Date.now() - 25 * 60 * 60 * 1000,
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const mockResponse = {
        ok: true,
        json: async () => mockProducts,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const products = await getProducts();

      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products", {
        next: { revalidate: 3600 },
      });
      expect(products).toEqual(mockProducts);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedProducts", expect.any(String));
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedProducts");
      if (setItemCall) {
        try {
          const cachedData = JSON.parse(setItemCall[1]);
          expect(cachedData).toHaveProperty('products', mockProducts);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
          throw new Error("Failed to parse cached products JSON (expired cache test)");
        }
      }
    });

    it("should use cached data as fallback when fetch fails and valid cache exists", async () => {
      const cachedData = {
        products: mockProducts,
        timestamp: Date.now(),
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      // @ts-ignore - mocking fetch
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      const products = await getProducts();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should throw error if fetch fails and no cache is available", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      // @ts-ignore - mocking fetch
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getProducts()).rejects.toThrow("Network error");
      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products", {
         next: { revalidate: 3600 },
       });
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("getCategories", () => {
    it("should fetch categories from API when no cache exists", async () => {
      const mockResponse = {
        ok: true,
        json: async () => mockCategories,
      };

      localStorageMock.getItem.mockReturnValue(null);

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const categories = await getCategories();

      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products/categories", {
        next: { revalidate: 86400 },
      });
      expect(categories).toEqual(mockCategories);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedCategories");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedCategories", expect.any(String));
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedCategories");
      if (setItemCall) {
        try {
          const cachedData = JSON.parse(setItemCall[1]);
          expect(cachedData).toHaveProperty('categories', mockCategories);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
          throw new Error("Failed to parse cached categories JSON");
        }
      }
    });

    it("should return cached categories when valid cache exists", async () => {
      const cachedData = {
        categories: mockCategories,
        timestamp: Date.now(),
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const categories = await getCategories();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(categories).toEqual(mockCategories);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedCategories");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should fetch from API when category cache is expired", async () => {
      const cachedData = {
        categories: mockCategories,
        timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const mockResponse = {
        ok: true,
        json: async () => mockCategories,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const categories = await getCategories();

      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products/categories", {
        next: { revalidate: 86400 },
      });
      expect(categories).toEqual(mockCategories);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedCategories");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("cachedCategories");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedCategories", expect.any(String));
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedCategories");
      if (setItemCall) {
        try {
          const cachedData = JSON.parse(setItemCall[1]);
          expect(cachedData).toHaveProperty('categories', mockCategories);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
          throw new Error("Failed to parse cached categories JSON (expired cache test)");
        }
      }
    });

    it("should return empty array as fallback when fetch fails and no cache", async () => {
      // @ts-ignore - mocking fetch
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      localStorageMock.getItem.mockReturnValue(null);

      const categories = await getCategories();

      expect(global.fetch).toHaveBeenCalled();
      expect(categories).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedCategories");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("getProduct", () => {
    it("should fetch a single product by ID when not in cache", async () => {
      const productId = 1;
      const mockProduct = mockProducts[0];

      localStorageMock.getItem.mockReturnValue(null);

      const mockResponse = {
        ok: true,
        json: async () => mockProduct,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const product = await getProduct(productId);

      expect(global.fetch).toHaveBeenCalledWith(`https://fakestoreapi.com/products/${productId}`, {
        next: { revalidate: 3600 },
      });
      expect(product).toEqual(mockProduct);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should return cached product if available in the product list cache", async () => {
      const productId = 1;

      const cachedData = {
        products: mockProducts,
        timestamp: Date.now(),
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const product = await getProduct(productId);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(product).toEqual(mockProducts[0]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should fetch from API if product is not in the cached list, even if cache exists", async () => {
      const productId = 3;
      const mockProduct3 = {
        id: 3,
        title: "Test Product 3",
        price: 10.00,
        description: "Test description 3",
        category: "test",
        image: "test3.jpg",
        rating: { rate: 3.0, count: 10 },
      };

      const cachedData = {
        products: mockProducts,
        timestamp: Date.now(),
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const mockResponse = {
        ok: true,
        json: async () => mockProduct3,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockResponse);

      const product = await getProduct(productId);

      expect(global.fetch).toHaveBeenCalledWith(`https://fakestoreapi.com/products/${productId}`, {
        next: { revalidate: 3600 },
      });
      expect(product).toEqual(mockProduct3);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should throw error if fetch fails and no product list cache is available", async () => {
      const productId = 1;

      // @ts-ignore - mocking fetch
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      localStorageMock.getItem.mockReturnValue(null);

      await expect(getProduct(productId)).rejects.toThrow("Network error");
      expect(global.fetch).toHaveBeenCalledWith(`https://fakestoreapi.com/products/${productId}`, {
         next: { revalidate: 3600 },
       });
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cachedProducts");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("syncWithRemoteAPI", () => {
    it("should sync products and categories when online and cache is empty or expired", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockProductsResponse = {
        ok: true,
        json: async () => mockProducts,
      };

      const mockCategoriesResponse = {
        ok: true,
        json: async () => mockCategories,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockProductsResponse);
      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockCategoriesResponse);

      await syncWithRemoteAPI();

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedProducts", expect.any(String));
      const setItemProductCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedProducts");
      if (setItemProductCall) {
        try {
          const cachedData = JSON.parse(setItemProductCall[1]);
          expect(cachedData).toHaveProperty('products', mockProducts);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
           throw new Error("Failed to parse cached products JSON (sync products)");
        }
      }
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedCategories", expect.any(String));
      const setItemCategoryCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedCategories");
      if (setItemCategoryCall) {
         try {
           const cachedData = JSON.parse(setItemCategoryCall[1]);
           expect(cachedData).toHaveProperty('categories', mockCategories);
           expect(cachedData).toHaveProperty('timestamp');
           expect(typeof cachedData.timestamp).toBe('number');
         } catch (e) {
            throw new Error("Failed to parse cached categories JSON (sync categories)");
         }
      }
    });

    it("should not sync when offline", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      vi.clearAllMocks();

      await syncWithRemoteAPI();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(localStorageMock.getItem).not.toHaveBeenCalled();

      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });
    });

    it("should show toast if products sync fails", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockProductsResponse = {
        ok: false,
        status: 500,
      };

      const mockCategoriesResponse = {
        ok: true,
        json: async () => mockCategories,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockProductsResponse);
      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockCategoriesResponse);

      await syncWithRemoteAPI();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
      expect(localStorageMock.setItem).not.toHaveBeenCalled();

      expect(toast).toHaveBeenCalledWith({
        title: "Sync failed",
        description: "Could not sync with the server. Some data may be outdated.",
        variant: "destructive",
      });
    });

    it("should show toast if categories sync fails", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockProductsResponse = {
        ok: true,
        json: async () => mockProducts,
      };

      const mockCategoriesResponse = {
        ok: false,
        status: 500,
      };

      // @ts-ignore - mocking fetch
      global.fetch.mockResolvedValueOnce(mockProductsResponse);
      // @ts-ignore - mocking fetch
      global.fetch.mockRejectedValueOnce(mockCategoriesResponse);

      await syncWithRemoteAPI();

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("cachedProducts", expect.any(String));
      const setItemCall = localStorageMock.setItem.mock.calls.find(call => call[0] === "cachedProducts");
      if (setItemCall) {
        try {
          const cachedData = JSON.parse(setItemCall[1]);
          expect(cachedData).toHaveProperty('products', mockProducts);
          expect(cachedData).toHaveProperty('timestamp');
          expect(typeof cachedData.timestamp).toBe('number');
        } catch (e) {
          throw new Error("Failed to parse cached products JSON (sync categories fail)");
        }
      }

      expect(toast).toHaveBeenCalledWith({
        title: "Sync failed",
        description: "Could not sync with the server. Some data may be outdated.",
        variant: "destructive",
      });
    });
  });
});