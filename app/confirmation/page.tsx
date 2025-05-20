import type { Metadata } from "next"
import OrderConfirmation from "@/components/order/order-confirmation"

export const metadata: Metadata = {
  title: "Order Confirmation | Elegance Market",
  description: "Thank you for your order",
}

export default function ConfirmationPage() {
  return <OrderConfirmation />
}
