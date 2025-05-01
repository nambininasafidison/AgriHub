"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  PieChart,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderStatistics } from "@/lib/actions/orders";
import { DashboardData } from "@/lib/types";

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
    productCount: 0,
    lowStockProducts: [],
    recentOrders: [],
    ordersByStatus: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const orderStats = await getOrderStatistics();

        if (orderStats.error) {
          console.error("Failed to load dashboard data:", orderStats.error);
          return;
        }

        setDashboardData({
          totalSales: orderStats.totalRevenue || 0,
          orderCount: orderStats.totalOrders || 0,
          customerCount: 15,
          productCount: 15, 
          lowStockProducts: [],
          recentOrders: orderStats.recentOrders || [],
          ordersByStatus: orderStats.ordersByStatus || {
            pending: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          },
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 md:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">
          Gérez votre boutique, vos stocks et vos commandes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ventes totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalSales.toLocaleString()} Ar
            </div>
            <p className="text-xs text-green-500 flex items-center">
              +12.5% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.orderCount}</div>
            <p className="text-xs text-green-500 flex items-center">
              +8.2% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.customerCount}
            </div>
            <p className="text-xs text-green-500 flex items-center">
              +4.5% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.productCount}
            </div>
            <p className="text-xs text-gray-500 flex items-center">
              +2 nouveaux produits
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu des ventes</CardTitle>
            <CardDescription>
              Ventes mensuelles pour l'année en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
              <LineChart className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Graphique des ventes</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statut des commandes</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-md">
              <div className="flex items-center mb-4">
                <PieChart className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-gray-500">
                  Graphique des statuts
                </span>
              </div>

              <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">En attente</span>
                  <span className="text-sm font-medium">
                    {dashboardData.ordersByStatus.pending}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confirmées</span>
                  <span className="text-sm font-medium">
                    {dashboardData.ordersByStatus.confirmed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expédiées</span>
                  <span className="text-sm font-medium">
                    {dashboardData.ordersByStatus.shipped}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Livrées</span>
                  <span className="text-sm font-medium">
                    {dashboardData.ordersByStatus.delivered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annulées</span>
                  <span className="text-sm font-medium">
                    {dashboardData.ordersByStatus.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {dashboardData.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les dernières commandes reçues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Numéro</th>
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Montant</th>
                    <th className="text-left py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {order.total.toLocaleString()} Ar
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
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
                            : order.status === "confirmed"
                            ? "Confirmée"
                            : order.status === "shipped"
                            ? "Expédiée"
                            : order.status === "delivered"
                            ? "Livrée"
                            : "Annulée"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
