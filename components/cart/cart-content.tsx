"use client"

import { useCartStore } from "@/store/cart-store"
import { useOrderStore } from "@/store/order-store"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, MinusCircle, PlusCircle, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function CartContent() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCartStore()
  const { createOrder } = useOrderStore()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [productToRemove, setProductToRemove] = useState<number | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Initialize Zustand stores on the client side to avoid hydration mismatch warnings
  useEffect(() => {
    useCartStore.persist.rehydrate()
    useOrderStore.persist.rehydrate()
    setIsClient(true)
  }, [])

  const handleCheckout = () => {
    try {
      setIsCheckingOut(true)
      const totalAmount = getCartTotal()

      createOrder(cart, totalAmount)

      clearCart()

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and is being processed.",
        variant: "default",
      })

      router.push("/confirmation")
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const totalAmount = isClient ? getCartTotal() : 0
  const totalItems = isClient ? cart.reduce((total, item) => total + item.quantity, 0) : 0

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Looks like you haven't added any products to your cart yet. Browse our collection to find something
                you'll love.
              </p>
              <Button onClick={() => router.push("/")} className="gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cart Items ({totalItems})</CardTitle>
            <CardDescription>Review and modify your selected items</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex flex-col sm:flex-row items-center gap-4 py-4"
                >
                  <div className="w-24 h-24 relative flex-shrink-0 bg-white rounded-md overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Category: {item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <AlertDialog
                    open={productToRemove === item.id}
                    onOpenChange={(open) => {
                      if (!open) setProductToRemove(null)
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setProductToRemove(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this item from your cart?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (productToRemove) {
                              removeFromCart(productToRemove)
                              setProductToRemove(null)
                            }
                          }}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Separator className="sm:hidden mt-4" />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(totalAmount * 0.05)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            <div className="font-medium flex justify-between w-full mb-4">
              <span>Total</span>
              <span>{formatCurrency(totalAmount * 1.05)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                  Processing...
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
