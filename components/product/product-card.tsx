"use client";

import type { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ImageOff } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    const lowerCategory = category.toLowerCase();

    if (lowerCategory.includes("men")) {
      return "men";
    } else if (lowerCategory.includes("women")) {
      return "women";
    } else {
      return lowerCategory; 
    }
  };

  const categoryClass = getCategoryBadgeClass(product.category);
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
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={product.image || "/placeholder.svg?height=200&width=200"}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
                loading="lazy"
                onLoad={() => setIsImageLoading(false)}
              />
            </>
          </motion.div>
          <Badge
            className={`absolute top-2 left-2 bg-primary text-primary-foreground hover:bg-primary rounded-full px-3 category-badge-${categoryClass}`}
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
                  i < Math.round(product.rating.rate) ? "text-yellow-600 fill-yellow-600" : "text-gray-300"
                }`}
                aria-hidden="true"
                />
            ))}
             <span
              className="text-xs text-foreground ml-1"
              aria-label={`Rating ${product.rating.rate} out of 5, ${product.rating.count} reviews`}
            >
              ({product.rating.count})
            </span>
          </div>
          <h3 className="font-medium line-clamp-2 mb-2 text-lg group-hover:text-primary transition-colors">{product.title}</h3>
          <p className="text-sm text-foreground line-clamp-2 mb-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <div className="flex items-center justify-between w-full">
            <p className="font-bold text-lg text-foreground">{formatCurrency(product.price)}</p>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="btn-gradient"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
