import { getSession } from "@/lib/actions/auth";
import { getOrders } from "@/lib/actions/orders";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function OrdersPage() {
  const user = await getSession();

  if (!user) {
    redirect("/auth/login?redirect=/orders");
  }

  const orders = await getOrders();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Button asChild>
            <Link href="/products" className="flex items-center gap-2 mx-auto">
              Découvrir nos produits
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Commande #{order.id}</p>
                  <p className="font-medium">
                    Passée le{" "}
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "pending"
                      ? "En attente"
                      : order.status === "shipped"
                      ? "Expédiée"
                      : order.status === "delivered"
                      ? "Livrée"
                      : "Annulée"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()} Ar
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold">
                    {order.total.toLocaleString()} Ar
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-2 md:mt-0">
                  <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
