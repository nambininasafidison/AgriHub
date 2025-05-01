/**
 * Performance monitoring utilities
 */

// Track component render time
export function trackRenderTime(componentName: string) {
  if (typeof window === "undefined" || !window.performance) return () => {}

  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`)
    }

    // In production, you might want to send this to an analytics service
    if (process.env.NODE_ENV === "production" && duration > 100) {
      // Send to analytics service if render time is concerning
      // Example: sendToAnalytics('slow-render', { component: componentName, duration })
    }

    return duration
  }
}

// Track data fetching time
export async function trackFetchTime<T>(fetchFn: () => Promise<T>, operationName: string): Promise<T> {
  if (typeof window === "undefined" || !window.performance) return fetchFn()

  const startTime = performance.now()

  try {
    const result = await fetchFn()
    const endTime = performance.now()
    const duration = endTime - startTime

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${operationName} completed in ${duration.toFixed(2)}ms`)
    }

    // In production, you might want to send this to an analytics service
    if (process.env.NODE_ENV === "production" && duration > 500) {
      // Send to analytics service if fetch time is concerning
      // Example: sendToAnalytics('slow-fetch', { operation: operationName, duration })
    }

    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime

    console.error(`[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof window === "undefined" || !window.performance || !(performance as any).memory) {
    return null
  }

  const memory = (performance as any).memory

  return {
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    percentUsed: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}
