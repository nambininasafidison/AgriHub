import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"

export const metadata: Metadata = {
  title: "Checkout | Agrihub",
  description: "Complete your purchase on Agrihub",
}

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()

  // Redirect if not logged in
  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="font-bold text-2xl">Agri</span>
          <span className="text-green-600 font-bold text-2xl">Hub</span>
        </Link>
        <CheckoutSteps />
      </div>
      {children}
    </div>
  )
}
