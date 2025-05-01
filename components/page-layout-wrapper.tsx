"use client"

import type React from "react"

import { useLayout } from "@/contexts/layout-context"
import { usePageLayout } from "@/hooks/use-page-layout"
import Header from "@/components/header"
import Footer from "@/components/footer"

export function PageLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { showHeader, showFooter, headerConfig } = useLayout()

  // This hook will update the layout based on the current page
  usePageLayout()

  return (
    <>
      {showHeader && <Header config={headerConfig} />}
      <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>
      {showFooter && <Footer />}
    </>
  )
}
