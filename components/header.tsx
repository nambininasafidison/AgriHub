"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SearchBar from "@/components/search/search-bar"
import { useSession } from "@/components/auth/auth-provider"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { session } = useSession()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-600">
            AgriCommerceHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${
                pathname === "/" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium ${
                pathname === "/products" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Produits
            </Link>
            <Link
              href="/intrants"
              className={`text-sm font-medium ${
                pathname === "/intrants" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Intrants
            </Link>
            <Link
              href="/marketplace"
              className={`text-sm font-medium ${
                pathname === "/marketplace" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Marketplace
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Panier">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {session ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" aria-label="Profil">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <SearchBar className="w-full" />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 py-4 border-t">
              <Link
                href="/"
                className={`text-sm font-medium ${pathname === "/" ? "text-green-600" : "text-gray-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/products"
                className={`text-sm font-medium ${pathname === "/products" ? "text-green-600" : "text-gray-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                href="/intrants"
                className={`text-sm font-medium ${pathname === "/intrants" ? "text-green-600" : "text-gray-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Intrants
              </Link>
              <Link
                href="/marketplace"
                className={`text-sm font-medium ${pathname === "/marketplace" ? "text-green-600" : "text-gray-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              {!session && (
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              )}
              {session && session.role === "admin" && (
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${pathname === "/dashboard" ? "text-green-600" : "text-gray-600"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
