"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type LayoutContextType = {
  showHeader: boolean
  showFooter: boolean
  headerConfig: {
    showProductsNav: boolean
    showIntrantsNav: boolean
    showFarmersNav: boolean
    showAboutNav: boolean
    transparent?: boolean
  }
  setShowHeader: (show: boolean) => void
  setShowFooter: (show: boolean) => void
  setHeaderConfig: (config: Partial<LayoutContextType["headerConfig"]>) => void
  updateLayout: (options: {
    showHeader?: boolean
    showFooter?: boolean
    headerConfig?: Partial<LayoutContextType["headerConfig"]>
  }) => void
}

const defaultHeaderConfig = {
  showProductsNav: true,
  showIntrantsNav: true,
  showFarmersNav: true,
  showAboutNav: true,
  transparent: false,
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [headerConfig, setHeaderConfigState] = useState(defaultHeaderConfig)

  const setHeaderConfig = useCallback((config: Partial<LayoutContextType["headerConfig"]>) => {
    setHeaderConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  const updateLayout = useCallback(
    (options: {
      showHeader?: boolean
      showFooter?: boolean
      headerConfig?: Partial<LayoutContextType["headerConfig"]>
    }) => {
      if (options.showHeader !== undefined && options.showHeader !== showHeader) {
        setShowHeader(options.showHeader)
      }
      if (options.showFooter !== undefined && options.showFooter !== showFooter) {
        setShowFooter(options.showFooter)
      }
      if (options.headerConfig) {
        setHeaderConfig(options.headerConfig)
      }
    },
    [showHeader, showFooter, setHeaderConfig],
  )

  return (
    <LayoutContext.Provider
      value={{
        showHeader,
        showFooter,
        headerConfig,
        setShowHeader,
        setShowFooter,
        setHeaderConfig,
        updateLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
