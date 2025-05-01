"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProductImageGalleryProps {
  images: string[]
  alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return

    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // Keyboard navigation for dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDialogOpen) return

      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        setIsDialogOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDialogOpen])

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            ref={containerRef}
            className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={displayImages[currentIndex] || "/placeholder.svg"}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              className={cn("object-contain transition-transform duration-300", {
                "scale-150": isZoomed,
                "scale-100": !isZoomed,
              })}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              onClick={() => (isMobile ? setIsDialogOpen(true) : setIsZoomed(!isZoomed))}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(!isZoomed)
              }}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </Button>
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 hover:bg-white/90 ml-2 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 hover:bg-white/90 mr-2 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <div className="relative aspect-square bg-black/90 rounded-lg">
            <Image
              src={displayImages[currentIndex] || "/placeholder.svg"}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 hover:bg-white/90 ml-2"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 hover:bg-white/90 mr-2"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative w-16 h-16 border rounded-md overflow-hidden flex-shrink-0 snap-start",
                currentIndex === index ? "ring-2 ring-green-500" : "",
              )}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
