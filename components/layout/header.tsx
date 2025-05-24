"use client"

import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import SearchBar from "@/components/filters/search-bar"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"

export default function Header() {
  const { cart, getCartItemCount } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
    const unsubHydrate = useCartStore.persist.onHydrate(() => {
      setIsLoading(false)
    })

    // Force rehydration with timeout fallback
    useCartStore.persist.rehydrate()

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      unsubHydrate()
      clearTimeout(timeout)
    }
  }, [])

  // Update cart item count when cart changes
  useEffect(() => {
    if (isHydrated && !isLoading) {
      setCartItemCount(getCartItemCount())
    }
  }, [cart, getCartItemCount, isHydrated, isLoading])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cart", label: "Cart" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 h-16",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background border-b",
      )}
      role="banner"
    >
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-foreground flex items-center h-8">
            <div className="w-8 h-8 mr-2 flex-shrink-0">
              <Image
                src="/othaim-logo.svg"
                alt="Othaim Market Logo"
                width={32}
                height={32}
                className="w-full h-full"
                priority
              />
            </div>
            <span className="text-primary font-bold">Othaim</span> Market
          </Link>

          <nav className="hidden md:flex items-center gap-8 h-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full h-8 flex items-center",
                  pathname === link.href ? "text-primary after:w-full" : "text-foreground",
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4 h-8">
          <div className="w-64">
            <SearchBar />
          </div>
          <ThemeToggle />
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative w-10 h-10"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="h-4 w-4" />
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                          {cartItemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden h-8">
          <ThemeToggle />
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative w-10 h-10"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="h-4 w-4" />
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                          {cartItemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav aria-label="Mobile navigation">
                <div className="flex flex-col gap-6 mt-6">
                  <SearchBar />
                  <Link
                    href="/"
                    className="text-lg font-medium transition-colors hover:text-primary text-foreground"
                    aria-current={pathname === "/" ? "page" : undefined}
                  >
                    Home
                  </Link>
                  <Link
                    href="/cart"
                    className="text-lg font-medium transition-colors hover:text-primary text-foreground"
                    aria-current={pathname === "/cart" ? "page" : undefined}
                  >
                    Cart
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
