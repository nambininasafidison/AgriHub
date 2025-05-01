"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, ShoppingBag, Store, Settings } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface UserMenuProps {
  user: UserType
  isTransparent?: boolean
}

export default function UserMenu({ user, isTransparent = false }: UserMenuProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth/logout")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full p-1",
            isTransparent ? "hover:bg-white/10" : "hover:bg-gray-100",
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className={cn("hidden md:inline text-sm font-medium", isTransparent ? "text-white" : "")}>
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Mes commandes</span>
          </Link>
        </DropdownMenuItem>
        {(user.role === "farmer" || user.role === "supplier") && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer flex items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
