"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by error boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    if (fallback) return <>{fallback}</>

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
        <p className="text-gray-600 mb-4">
          Nous sommes désolés, une erreur inattendue s'est produite. Veuillez réessayer ultérieurement.
        </p>
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-4 max-w-md overflow-auto text-left">
            <p className="text-red-700 font-mono text-sm">{error.message}</p>
          </div>
        )}
        <Button onClick={() => window.location.reload()}>Rafraîchir la page</Button>
      </div>
    )
  }

  return <>{children}</>
}
