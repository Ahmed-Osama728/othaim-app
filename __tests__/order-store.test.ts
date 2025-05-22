import { useOrderStore } from "@/store/order-store"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

const mockCartItems = [
  {
    id: 1,
    title: "Test Product 1",
    price: 99.99,
    description: "Test description 1",
    category: "test",
    image: "test1.jpg",
    quantity: 2,
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
    category: "test",
    image: "test2.jpg",
    quantity: 1,
    rating: {
      rate: 4.0,
      count: 50,
    },
  },
]

// Reset store before each test
beforeEach(() => {
  const { result } = renderHook(() => useOrderStore())
  act(() => {
    // Reset the store 
    result.current.orders = []
    result.current.lastOrder = null
  })
})

describe("Order Store", () => {
  it("should initialize with empty orders and null lastOrder", () => {
    const { result } = renderHook(() => useOrderStore())
    expect(result.current.orders).toEqual([])
    expect(result.current.lastOrder).toBeNull()
  })

  it("should create a new order", () => {
    const { result } = renderHook(() => useOrderStore())
    const totalAmount = 249.97 // (99.99 * 2) + 49.99

    act(() => {
      result.current.createOrder(mockCartItems, totalAmount)
    })

    expect(result.current.orders).toHaveLength(1)
    expect(result.current.lastOrder).not.toBeNull()

    if (result.current.lastOrder) {
      expect(result.current.lastOrder.items).toEqual(mockCartItems)
      expect(result.current.lastOrder.totalAmount).toBe(totalAmount)
      expect(result.current.lastOrder.id).toBeDefined()
      expect(result.current.lastOrder.date).toBeDefined()
    }
  })

  it("should retrieve an order by ID", () => {
    const { result } = renderHook(() => useOrderStore())
    let orderId: string = ""

    act(() => {
      const order = result.current.createOrder(mockCartItems, 249.97)
      orderId = order.id
    })

    const retrievedOrder = result.current.getOrderById(orderId)
    expect(retrievedOrder).toBeDefined()
    expect(retrievedOrder?.id).toBe(orderId)
  })

  it("should return undefined for non-existent order ID", () => {
    const { result } = renderHook(() => useOrderStore())

    act(() => {
      result.current.createOrder(mockCartItems, 249.97)
    })

    const retrievedOrder = result.current.getOrderById("non-existent-id")
    expect(retrievedOrder).toBeUndefined()
  })

  it("should get all orders", () => {
    const { result } = renderHook(() => useOrderStore())

    act(() => {
      result.current.createOrder(mockCartItems, 249.97)
      result.current.createOrder([mockCartItems[0]], 199.98)
    })

    const allOrders = result.current.getAllOrders()
    expect(allOrders).toHaveLength(2)
  })
})
