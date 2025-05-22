import { formatCurrency, generateOrderId } from "@/lib/utils"
import { describe, expect, it} from "vitest"

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(99.99)).toBe("$99.99")
      expect(formatCurrency(100)).toBe("$100.00")
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
      expect(formatCurrency(0)).toBe("$0.00")
    })
  })

  describe("generateOrderId", () => {
    it("should generate a valid order ID", () => {
      const orderId = generateOrderId()
      expect(orderId).toMatch(/^ORD-[A-Z0-9]{6}-\d+$/)
    })

    it("should generate unique order IDs", () => {
      const orderIds = new Set()
      for (let i = 0; i < 100; i++) {
        orderIds.add(generateOrderId())
      }
      expect(orderIds.size).toBe(100)
    })
  })
})
