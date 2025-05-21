"use client"

import { useOrderStore } from "@/store/order-store"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function OrderConfirmation() {
  const { lastOrder } = useOrderStore()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize Zustand store on the client side to avoid hydration mismatch warnings
    useOrderStore.persist.rehydrate()
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!lastOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <ShoppingBag className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">No order found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  It seems you haven't placed any orders yet. Browse our products and add items to your cart.
                </p>
                <Button onClick={() => router.push("/")} className="gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been received and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order ID</h3>
                  <p className="font-medium">{lastOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p className="font-medium">{new Date(lastOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h3>
                  <p className="font-medium">{formatCurrency(lastOrder.totalAmount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                  <p className="font-medium">Credit Card</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {lastOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(lastOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(lastOrder.totalAmount * 0.05)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(lastOrder.totalAmount * 1.05)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")} className="gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
