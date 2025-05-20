"use client"

import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import SearchBar from "@/components/filters/search-bar"
import { cn } from "@/lib/utils"

export default function Header() {
  const { cart } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  // We're using useSearchParams in this client component
  const searchParams = useSearchParams()

  // Update cart item count when cart changes
  useEffect(() => {
    setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0))
  }, [cart])

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cart", label: "Cart" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background border-b",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            <span className="text-primary">Elegance</span> Market
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                  pathname === link.href ? "text-primary after:w-full" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <SearchBar />
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="destructive" className="h-5 min-w-5 px-1">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="destructive" className="h-5 min-w-5 px-1">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                <SearchBar />
                <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/cart" className="text-lg font-medium transition-colors hover:text-primary">
                  Cart
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
