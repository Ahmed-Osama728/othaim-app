import type { Metadata } from "next"
import CartContent from "@/components/cart/cart-content"

export const metadata: Metadata = {
  title: "Your Shopping Cart | Othaim Market",
  description: "View and manage items in your shopping cart",
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartContent />
    </div>
  )
}
