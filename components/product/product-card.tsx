"use client"

import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group card-hover-effect shadow-sm">
        <div className="relative aspect-square bg-white p-4 overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="h-full w-full relative"
          >
            <Image
              src={imageError ? "/placeholder.svg" : product.image}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImageError(true)}
            />
          </motion.div>
          <Badge
            className={`absolute top-2 left-2 bg-primary/90 hover:bg-primary rounded-full px-3 category-badge-${product.category.split(" ")[0].toLowerCase()}`}
          >
            {product.category}
          </Badge>
        </div>
        <CardContent className="flex-grow p-4">
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating.rate) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.rating.count})</span>
          </div>
          <h3 className="font-medium line-clamp-2 mb-2 text-lg group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <div className="flex items-center justify-between w-full">
            <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
            <Button size="sm" onClick={handleAddToCart} className="btn-gradient">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
