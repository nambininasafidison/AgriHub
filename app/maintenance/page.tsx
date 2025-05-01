import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Site en maintenance | AgriHub",
  description: "Notre site est actuellement en maintenance. Nous serons de retour bientôt!",
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <Image src="/logo.svg" alt="AgriHub Logo" width={150} height={50} className="mx-auto" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Site en maintenance</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-gray-600 mb-4">
            Nous effectuons actuellement des mises à jour pour améliorer votre expérience. Nous serons de retour très
            bientôt!
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-green-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>

          <p className="text-sm text-gray-500">
            Temps estimé: <span className="font-medium">30 minutes</span>
          </p>
        </div>

        <p className="text-gray-500 text-sm">
          Pour toute question urgente, veuillez nous contacter à{" "}
          <a href="mailto:support@agrihub.mg" className="text-green-600 hover:underline">
            support@agrihub.mg
          </a>
        </p>
      </div>
    </div>
  )
}
