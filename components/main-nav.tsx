"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, Store, Truck, User, Menu, X, Search, Heart } from "lucide-react"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-5 w-5 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: <Store className="h-5 w-5 mr-2" />,
      active: pathname === "/marketplace",
    },
    {
      href: "/cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5 mr-2" />,
      active: pathname === "/cart",
    },
    {
      href: "/orders",
      label: "Orders",
      icon: <Truck className="h-5 w-5 mr-2" />,
      active: pathname === "/orders",
    },
    {
      href: "/account",
      label: "Account",
      icon: <User className="h-5 w-5 mr-2" />,
      active: pathname === "/account",
    },
    {
      href: "/wishlist",
      label: "Wishlist",
      icon: <Heart className="h-5 w-5 mr-2" />,
      active: pathname === "/wishlist",
    },
  ]

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-green-600">AgriCommerce</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-600",
                  route.active ? "text-green-600" : "text-gray-700",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex relative w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-2 px-4 bg-white border-t">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  route.active ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
