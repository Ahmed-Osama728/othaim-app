"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BannerSlide {
  id: number
  image: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "/banner-electronics.webp",
    title: "Latest Electronics",
    description: "Discover cutting-edge technology at unbeatable prices",
    ctaText: "Shop Electronics",
    ctaLink: "/?category=electronics",
  },
  {
    id: 2,
    image: "/banner-fashion.webp",
    title: "Fashion Collection",
    description: "Upgrade your wardrobe with our stylish collection",
    ctaText: "Shop Fashion",
    ctaLink: "/?category=men's%20clothing",
  },
  {
    id: 3,
    image: "/banner-jewelery.webp",
    title: "Elegant Jewelry",
    description: "Timeless pieces for every occasion",
    ctaText: "Shop Jewelry",
    ctaLink: "/?category=jewelery",
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const totalSlides = bannerSlides.length
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const startSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
    }

    slideInterval.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
      }
    }, 5000) 
  }, [isPaused, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    startSlideTimer()
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    startSlideTimer()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    startSlideTimer()
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (paginationRef.current && paginationRef.current.contains(event.target as Node)) {
      if (event.key === "ArrowRight") {
        nextSlide()
        event.preventDefault()
      } else if (event.key === "ArrowLeft") {
        prevSlide()
        event.preventDefault()
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      startSlideTimer()
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        if (slideInterval.current) {
          clearInterval(slideInterval.current)
        }
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [startSlideTimer, handleKeyDown, isClient])

  if (!isClient) {
    return null
  }

  return (
    <div
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Hero banner image slider"
    >
      <div className="relative w-full h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            aria-hidden={index !== currentSlide}
          >
            <div className="relative w-full h-full">
              {index === currentSlide ||
              index === (currentSlide + 1) % totalSlides ||
              index === (currentSlide - 1 + totalSlides) % totalSlides ? (
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  quality={75} // Reduced from default 80 to optimize file size
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{slide.title}</h2>
                <p className="text-sm md:text-lg mb-4 md:mb-6 max-w-md">{slide.description}</p>
                <div>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white" aria-label={slide.ctaText}>
                    <a href={slide.ctaLink} tabIndex={index === currentSlide ? 0 : -1}>
                      {slide.ctaText}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2"
        ref={paginationRef}
        role="tablist"
        aria-label="Banner slide pagination"
      >
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80",
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
            role="tab"
            tabIndex={index === currentSlide ? 0 : -1}
          />
        ))}
      </div>
    </div>
  )
}
