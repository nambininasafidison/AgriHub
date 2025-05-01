"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function HeadphonesImage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      const headphones = container.querySelector(".headphones") as HTMLElement
      if (headphones) {
        headphones.style.transform = `translate(${x * 10}px, ${y * 10}px) rotate(${x * 5}deg)`
      }

      const circles = container.querySelectorAll(".circle") as NodeListOf<HTMLElement>
      circles.forEach((circle, i) => {
        const factor = ((i % 3) + 1) * 2
        circle.style.transform = `translate(${x * factor * 10}px, ${y * factor * 10}px)`
      })
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%] relative">
      <Image
        src="/placeholder.svg?height=400&width=400"
        alt="Blue Headphones"
        width={400}
        height={400}
        className="headphones object-contain transition-transform duration-300 ease-out"
      />

      {/* Decorative circles */}
      <div className="circle absolute top-[10%] right-[20%] w-3 h-3 rounded-full bg-gray-300 transition-transform duration-300 ease-out"></div>
      <div className="circle absolute top-[20%] left-[10%] w-4 h-4 rounded-full bg-gray-300 transition-transform duration-300 ease-out"></div>
      <div className="circle absolute bottom-[30%] right-[10%] w-3 h-3 rounded-full bg-navy-blue transition-transform duration-300 ease-out"></div>
      <div className="circle absolute bottom-[10%] left-[30%] w-4 h-4 rounded-full bg-navy-blue transition-transform duration-300 ease-out"></div>
      <div className="circle absolute bottom-[5%] right-[40%] w-3 h-3 rounded-full bg-gray-300 transition-transform duration-300 ease-out"></div>

      {/* Center indicator */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2">
        <div className="w-6 h-6 border-2 border-gray-300 rotate-45"></div>
      </div>
    </div>
  )
}
