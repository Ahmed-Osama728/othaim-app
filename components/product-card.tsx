"use client"

import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group border rounded-lg overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-white p-4">
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />
        </motion.div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium line-clamp-2 mb-1 flex-grow">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.category}</p>
        <div className="flex items-center justify-between mt-auto">
          <p className="font-bold">{formatCurrency(product.price)}</p>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
