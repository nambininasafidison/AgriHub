import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Authentication | Agrihub",
  description: "Authentication pages for Agrihub platform",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft size={16} className="mr-2" />
              <span>Retour à l'accueil</span>
            </Link>
            <div className="flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-bold text-3xl">Agri</span>
                <span className="text-green-600 font-bold text-3xl">Hub</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className="py-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Agrihub. Tous droits réservés.</p>
      </div>
    </div>
  )
}
