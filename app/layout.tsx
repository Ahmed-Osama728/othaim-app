import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import Header from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { StoreProvider } from "@/providers/store-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import Footer from "@/components/layout/footer"
import NetworkStatus from "@/components/ui/network-status"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Othaim Market | Premium Shopping Experience",
  description: "Discover quality products at competitive prices with our modern e-commerce platform",
  keywords: ["e-commerce", "shopping", "online store", "products", "Othaim market"],
  authors: [{ name: "Othaim" }],
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={<div className="h-16 border-b"></div>}>
                <Header />
              </Suspense>
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <NetworkStatus />
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
