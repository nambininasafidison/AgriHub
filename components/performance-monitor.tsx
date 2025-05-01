"use client"

import { useEffect, useState } from "react"
import { getMemoryUsage } from "@/lib/utils/performance"

interface PerformanceMonitorProps {
  showInProduction?: boolean
}

export default function PerformanceMonitor({ showInProduction = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<{
    fps: number
    memory: any
    loadTime: number
  }>({
    fps: 0,
    memory: null,
    loadTime: 0,
  })

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" && !showInProduction) {
      return
    }

    let frameCount = 0
    let lastTime = performance.now()
    let animationFrameId: number

    const calculateFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime)),
          memory: getMemoryUsage(),
        }))

        frameCount = 0
        lastTime = currentTime
      }

      animationFrameId = requestAnimationFrame(calculateFPS)
    }

    // Calculate page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart

    setMetrics((prev) => ({
      ...prev,
      loadTime,
    }))

    // Start FPS calculation
    animationFrameId = requestAnimationFrame(calculateFPS)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [showInProduction])

  if (process.env.NODE_ENV !== "development" && !showInProduction) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs font-mono">
      <div>FPS: {metrics.fps}</div>
      <div>Load: {metrics.loadTime}ms</div>
      {metrics.memory && (
        <div>
          Mem: {Math.round(metrics.memory.usedJSHeapSize / 1024 / 1024)}MB /
          {Math.round(metrics.memory.jsHeapSizeLimit / 1024 / 1024)}MB
        </div>
      )}
    </div>
  )
}
