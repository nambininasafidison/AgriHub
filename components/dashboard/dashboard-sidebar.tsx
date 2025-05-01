"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, BarChart, Tag, Truck, Menu, Store } from "lucide-react"
import type { User } from "@/lib/types"

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isAdmin = user.role === "admin"
  const isFarmer = user.role === "farmer"
  const isSupplier = user.role === "supplier"

  const routes = [
    {
      title: "Vue d'ensemble",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "default",
      show: true,
    },
    {
      title: "Produits",
      href: "/dashboard/products",
      icon: Package,
      variant: "ghost",
      show: isFarmer || isAdmin,
    },
    {
      title: "Intrants",
      href: "/dashboard/intrants",
      icon: Store,
      variant: "ghost",
      show: isSupplier || isAdmin,
    },
    {
      title: "Commandes",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      variant: "ghost",
      show: true,
    },
    {
      title: "Clients",
      href: "/dashboard/customers",
      icon: Users,
      variant: "ghost",
      show: isAdmin,
    },
    {
      title: "Promotions",
      href: "/dashboard/coupons",
      icon: Tag,
      variant: "ghost",
      show: isAdmin,
    },
    {
      title: "Livraison",
      href: "/dashboard/shipping",
      icon: Truck,
      variant: "ghost",
      show: isAdmin,
    },
    {
      title: "Statistiques",
      href: "/dashboard/analytics",
      icon: BarChart,
      variant: "ghost",
      show: isAdmin || isFarmer || isSupplier,
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      variant: "ghost",
      show: true,
    },
  ]

  const filteredRoutes = routes.filter((route) => route.show)

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white border-b">
        <p className="font-semibold">Dashboard</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            <MobileSidebar routes={filteredRoutes} pathname={pathname} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 z-20">
        <ScrollArea className="flex flex-col h-full bg-white border-r">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Tableau de bord</h2>
            <nav className="space-y-2">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === route.href
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.title}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

function MobileSidebar({
  routes,
  pathname,
  setOpen,
}: {
  routes: any[]
  pathname: string
  setOpen: (open: boolean) => void
}) {
  return (
    <ScrollArea className="h-full py-6">
      <div className="px-6 mb-6">
        <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setOpen(false)}>
          <span className="font-bold text-2xl">Agri</span>
          <span className="text-green-600 font-bold text-2xl">Hub</span>
        </Link>
        <h2 className="text-lg font-semibold mb-6">Tableau de bord</h2>
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                pathname === route.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
    </ScrollArea>
  )
}
