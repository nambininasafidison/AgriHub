"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useLayout } from "@/contexts/layout-context"

type PageLayoutConfig = {
  showHeader: boolean
  showFooter: boolean
  headerConfig: {
    showProductsNav: boolean
    showIntrantsNav: boolean
    showFarmersNav: boolean
    showAboutNav: boolean
    transparent?: boolean
  }
}

// Define page configs outside the component to avoid recreating on each render
const pageConfigs: Record<string, Partial<PageLayoutConfig>> = {
  // Default config applies to all pages unless overridden
  default: {
    showHeader: true,
    showFooter: true,
    headerConfig: {
      showProductsNav: true,
      showIntrantsNav: true,
      showFarmersNav: true,
      showAboutNav: true,
      transparent: false,
    },
  },
  // Landing page with transparent header
  "/": {
    headerConfig: {
      transparent: true,
    },
  },
  // Checkout pages with simplified header
  "/checkout": {
    headerConfig: {
      showProductsNav: false,
      showIntrantsNav: false,
      showFarmersNav: false,
      showAboutNav: false,
    },
  },
  "/checkout/success": {
    headerConfig: {
      showProductsNav: false,
      showIntrantsNav: false,
      showFarmersNav: false,
      showAboutNav: false,
    },
  },
  // Auth pages with no header/footer
  "/auth/login": {
    showHeader: false,
    showFooter: false,
  },
  "/auth/register": {
    showHeader: false,
    showFooter: false,
  },
  "/auth/reset-password": {
    showHeader: false,
    showFooter: false,
  },
  "/auth/forgot-password": {
    showHeader: false,
    showFooter: false,
  },
  // Dashboard with simplified header
  "/dashboard": {
    headerConfig: {
      showProductsNav: false,
      showIntrantsNav: false,
      showFarmersNav: false,
      showAboutNav: false,
    },
    showFooter: false,
  },
}

export function usePageLayout() {
  const pathname = usePathname()
  const { updateLayout } = useLayout()
  const previousPathRef = useRef(pathname)

  useEffect(() => {
    // Skip if the path hasn't changed
    if (previousPathRef.current === pathname) {
      return
    }

    previousPathRef.current = pathname

    // First check for exact path match
    let config = pageConfigs[pathname]

    // If no exact match, check for path patterns
    if (!config) {
      // Check for dashboard subpages
      if (pathname.startsWith("/dashboard/")) {
        config = pageConfigs["/dashboard"]
      }
      // Check for auth subpages
      else if (pathname.startsWith("/auth/")) {
        // Find the closest auth page config
        const authBase = Object.keys(pageConfigs).find((path) => path.startsWith("/auth/") && pathname.startsWith(path))
        config = authBase ? pageConfigs[authBase] : pageConfigs["/auth/login"]
      }
      // Check for checkout subpages
      else if (pathname.startsWith("/checkout/")) {
        config = pageConfigs["/checkout"]
      }
    }

    // Apply default config merged with page-specific config
    // Create a stable reference to the merged config
    const mergedConfig = {
      ...pageConfigs.default,
      ...config,
    }

    updateLayout(mergedConfig)
  }, [pathname, updateLayout])

  return null
}
