import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">
              <span className="text-primary">Othaim</span> Market
            </h2>
            <p className="text-foreground text-sm leading-relaxed">
              Your premium shopping destination for quality products.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-foreground hover:text-primary transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Customer Service</h2>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors text-sm">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Connect With Us</h2>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-foreground hover:text-primary transition-colors w-5 h-5 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-foreground hover:text-primary transition-colors w-5 h-5 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-foreground hover:text-primary transition-colors w-5 h-5 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              Subscribe to our newsletter for updates and promotions.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-foreground text-sm">
            &copy; {new Date().getFullYear()} Othaim Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
