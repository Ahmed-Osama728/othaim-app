import { useCartStore } from "@/store/cart-store"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

const mockProduct = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  description: "Test description",
  category: "test",
  image: "test.jpg",
  rating: {
    rate: 4.5,
    count: 100,
  },
}

beforeEach(() => {
  const { result } = renderHook(() => useCartStore())
  act(() => {
    result.current.clearCart()
  })
})

describe("Cart Store", () => {
  it("should initialize with an empty cart", () => {
    const { result } = renderHook(() => useCartStore())
    expect(result.current.cart).toEqual([])
  })

  it("should add a product to the cart", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toEqual({
      ...mockProduct,
      quantity: 1,
    })
  })

  it("should increase quantity when adding the same product", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it("should remove a product from the cart", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.removeFromCart(mockProduct.id)
    })

    expect(result.current.cart).toHaveLength(0)
  })

  it("should update product quantity", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.updateQuantity(mockProduct.id, 5)
    })

    expect(result.current.cart[0].quantity).toBe(5)
  })

  it("should clear the cart", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart({ ...mockProduct, id: 2 })
      result.current.clearCart()
    })

    expect(result.current.cart).toHaveLength(0)
  })

  it("should calculate cart total correctly", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.updateQuantity(mockProduct.id, 3)
    })

    expect(result.current.getCartTotal()).toBeCloseTo(299.97, 2) // 99.99 * 3
  })

  it("should calculate cart item count correctly", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart({ ...mockProduct, id: 2 })
      result.current.updateQuantity(mockProduct.id, 3)
    })

    expect(result.current.getCartItemCount()).toBe(4) // 3 + 1
  })
})
