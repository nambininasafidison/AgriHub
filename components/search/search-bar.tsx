"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full max-w-sm ${className}`}>
      <Input
        type="text"
        placeholder="Rechercher des produits..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
