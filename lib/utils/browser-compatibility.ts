/**
 * Browser compatibility detection utility
 * This helps identify potential issues with older browsers
 */

export function detectBrowserCompatibility() {
  if (typeof window === "undefined") return { compatible: true }

  const userAgent = window.navigator.userAgent
  const browsers = {
    chrome: /chrome/i.test(userAgent) && !/edge|opr|opera/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    safari: /safari/i.test(userAgent) && !/chrome|opera/i.test(userAgent),
    edge: /edge/i.test(userAgent),
    ie: /msie|trident/i.test(userAgent),
    opera: /opr|opera/i.test(userAgent),
  }

  // Check for older browsers that might have compatibility issues
  const isIE = browsers.ie
  const isOldEdge =
    browsers.edge &&
    /edge\/\d+/i.test(userAgent) &&
    Number.parseInt(userAgent.match(/edge\/(\d+)/i)?.[1] || "0", 10) < 18
  const isOldChrome = browsers.chrome && Number.parseInt(userAgent.match(/chrome\/(\d+)/i)?.[1] || "0", 10) < 60
  const isOldFirefox = browsers.firefox && Number.parseInt(userAgent.match(/firefox\/(\d+)/i)?.[1] || "0", 10) < 60
  const isOldSafari = browsers.safari && Number.parseInt(userAgent.match(/version\/(\d+)/i)?.[1] || "0", 10) < 12

  const incompatible = isIE || isOldEdge || isOldChrome || isOldFirefox || isOldSafari

  return {
    compatible: !incompatible,
    browser: Object.keys(browsers).find((key) => browsers[key as keyof typeof browsers]) || "unknown",
    isIE,
    isOldEdge,
    isOldChrome,
    isOldFirefox,
    isOldSafari,
  }
}

/**
 * Checks if the device is a mobile device
 */
export function isMobileDevice() {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
}

/**
 * Checks if the device supports touch events
 */
export function isTouchDevice() {
  if (typeof window === "undefined") return false

  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
}
