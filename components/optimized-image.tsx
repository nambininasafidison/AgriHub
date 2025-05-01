import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fill = false,
  quality = 85,
  objectFit = "cover",
}: OptimizedImageProps) {
  // Handle placeholder images
  const imageSrc = src || "/placeholder.svg"

  // Handle SVG images differently (they don't need optimization)
  const isSvg = imageSrc.endsWith(".svg") || imageSrc.includes("placeholder.svg")

  return (
    <div className={cn("relative", className, fill ? "w-full h-full" : "")}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={!fill ? width || 300 : undefined}
        height={!fill ? height || 300 : undefined}
        className={cn("transition-opacity duration-300", {
          "object-contain": objectFit === "contain",
          "object-cover": objectFit === "cover",
          "object-fill": objectFit === "fill",
          "object-none": objectFit === "none",
          "object-scale-down": objectFit === "scale-down",
        })}
        priority={priority}
        sizes={sizes}
        fill={fill}
        quality={isSvg ? undefined : quality}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}
