import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Order } from "@/lib/types"
import { generateOrderId } from "@/lib/utils"

interface OrderState {
  orders: Order[]
  lastOrder: Order | null
  createOrder: (items: CartItem[], totalAmount: number) => Order
  getOrderById: (orderId: string) => Order | undefined
  getAllOrders: () => Order[]
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrder: null,

      createOrder: (items, totalAmount) => {
        const newOrder: Order = {
          id: generateOrderId(),
          date: new Date().toISOString(),
          items,
          totalAmount,
        }

        set((state) => ({
          orders: [...state.orders, newOrder],
          lastOrder: newOrder,
        }))

        return newOrder
      },

      getOrderById: (orderId) => {
        const { orders } = get()
        return orders.find((order) => order.id === orderId)
      },

      getAllOrders: () => {
        const { orders } = get()
        return orders
      },
    }),
    {
      name: "order-storage",
    },
  ),
)
