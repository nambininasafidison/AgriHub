"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Database } from "lucide-react"

interface HealthStatus {
  status: "healthy" | "unhealthy" | "error"
  databases: {
    mongodb: "connected" | "disconnected"
    postgres: "connected" | "disconnected"
  }
  timestamp: string
}

export function DbHealthCheck() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkHealth() {
      try {
        setLoading(true)
        const response = await fetch("/api/health", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Health check failed")
        }

        const data = await response.json()
        setHealth(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check database health")
      } finally {
        setLoading(false)
      }
    }

    checkHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center rounded-md bg-gray-100 p-3 text-sm">
        <Database className="mr-2 h-4 w-4 text-gray-500" />
        <span>Checking database connections...</span>
      </div>
    )
  }

  if (error || !health) {
    return (
      <div className="flex items-center rounded-md bg-red-100 p-3 text-sm text-red-800">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>{error || "Failed to check database health"}</span>
      </div>
    )
  }

  const { mongodb, postgres } = health.databases

  return (
    <div className="rounded-md border p-4">
      <h3 className="mb-2 font-medium">Database Status</h3>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          {mongodb === "connected" ? (
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
          )}
          <span>MongoDB: {mongodb}</span>
        </div>

        <div className="flex items-center text-sm">
          {postgres === "connected" ? (
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
          )}
          <span>PostgreSQL: {postgres}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">Last checked: {new Date(health.timestamp).toLocaleString()}</div>
    </div>
  )
}
