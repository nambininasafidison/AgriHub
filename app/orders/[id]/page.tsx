import { getSession } from "@/lib/actions/auth";
import { getOrderById } from "@/lib/actions/orders";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CreditCard } from "lucide-react";
import Image from "next/image";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSession();

  if (!user) {
    redirect("/auth/login?redirect=/orders");
  }

  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/orders"
        className="inline-flex items-center text-gray-600 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>Retour à mes commandes</span>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Commande #{order.id}</h1>
      <p className="text-gray-500 mb-8">Passée le {order.createdAt}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">Statut de la commande</h2>
          </div>
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
              : order.status === "processing"
              ? "Confirmée"
              : order.status === "shipped"
              ? "Expédiée"
              : order.status === "delivered"
              ? "Livrée"
              : "Annulée"}
          </span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">Livraison</h2>
          </div>
          <p className="text-sm">{order.customer}</p>
          <p className="text-sm text-gray-500">
            {typeof order.shippingAddress === "string"
              ? order.shippingAddress
              : `${order.shippingAddress.address || ""}, ${
                  order.shippingAddress.city || ""
                }, ${order.shippingAddress.postalCode || ""}`}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">Paiement</h2>
          </div>
          <p className="text-sm">{order.paymentMethod}</p>
          <p className="text-sm text-gray-500">
            Payé le {order.updatedAt || "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Articles commandés</h2>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
            >
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
                {item.variety && (
                  <p className="text-sm text-gray-500">
                    Variété: {item.variety}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Quantité: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {item.price.toLocaleString()} Ar
                </p>
                <p className="text-sm text-gray-500">
                  Total: {(item.price * item.quantity).toLocaleString()} Ar
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Sous-total</span>
            <span>
              {(
                order.total -
                5000 -
                Math.round((order.total * 0.08) / 1.08)
              ).toLocaleString()}{" "}
              Ar
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Livraison</span>
            <span>5,000 Ar</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Taxes</span>
            <span>
              {Math.round((order.total * 0.08) / 1.08).toLocaleString()} Ar
            </span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{order.total.toLocaleString()} Ar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
