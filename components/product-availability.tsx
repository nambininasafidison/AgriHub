import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface ProductAvailabilityProps {
  stock: number
}

export default function ProductAvailability({ stock }: ProductAvailabilityProps) {
  let statusColor = "text-green-600"
  let statusIcon = <CheckCircle className="h-5 w-5 text-green-600" />
  let statusText = "En stock"

  if (stock <= 0) {
    statusColor = "text-red-600"
    statusIcon = <XCircle className="h-5 w-5 text-red-600" />
    statusText = "Rupture de stock"
  } else if (stock <= 5) {
    statusColor = "text-amber-600"
    statusIcon = <AlertCircle className="h-5 w-5 text-amber-600" />
    statusText = `Plus que ${stock} en stock!`
  }

  return (
    <div>
      <p className="text-sm text-gray-500">Disponibilité</p>
      <div className="flex items-center gap-2">
        {statusIcon}
        <p className={`font-medium ${statusColor}`}>{statusText}</p>
      </div>
    </div>
  )
}
