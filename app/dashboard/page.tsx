"use client";

import { useAuth } from "@/components/auth/auth-provider";
import AnalyticsDashboard from "@/components/dashboard/analytics-dashboard";
import CouponManagement from "@/components/dashboard/coupon-management";
import OrderManagement from "@/components/dashboard/order-management";
import ProductManagement from "@/components/dashboard/product-management";
import ShippingManagement from "@/components/dashboard/shipping-management";
import StockManagement from "@/components/dashboard/stock-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard");
      return;
    }

    if (
      user.role !== "farmer" &&
      user.role !== "supplier" &&
      user.role !== "admin"
    ) {
      router.push("/");
      return;
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="stock">Stocks</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          {user.role === "admin" && (
            <>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="shipping">Livraison</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement user={user} />
        </TabsContent>

        <TabsContent value="stock">
          <StockManagement user={user} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement user={user} />
        </TabsContent>

        {user.role === "admin" && (
          <>
            <TabsContent value="coupons">
              <CouponManagement />
            </TabsContent>

            <TabsContent value="shipping">
              <ShippingManagement />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
