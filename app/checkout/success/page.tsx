import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLastOrderId } from "@/lib/actions/orders"
import { redirect } from "next/navigation"

export default async function CheckoutSuccessPage() {
  const orderId = await getLastOrderId()

  // Redirect if no order ID is found
  if (!orderId) {
    redirect("/")
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Commande confirmée!</h1>
        <p className="text-gray-600 mb-6">
          Merci pour votre commande. Nous avons bien reçu votre paiement et nous préparons votre colis.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Numéro de commande: {orderId}</span>
          </div>
          <p className="text-sm text-gray-500">
            Vous recevrez un email de confirmation avec les détails de votre commande.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/orders">Suivre ma commande</Link>
          </Button>
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              Continuer mes achats
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
