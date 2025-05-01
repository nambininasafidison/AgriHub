import { Truck, Clock, ShieldCheck } from "lucide-react"

export default function DeliveryInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium">Livraison rapide</p>
          <p className="text-xs text-gray-500">2-5 jours ouvrables</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium">Garantie de qualité</p>
          <p className="text-xs text-gray-500">Produits vérifiés</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium">Retours faciles</p>
          <p className="text-xs text-gray-500">Sous 14 jours</p>
        </div>
      </div>
    </div>
  )
}
