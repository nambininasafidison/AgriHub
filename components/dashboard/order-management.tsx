import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db/postgres/connection";
import { eq } from "drizzle-orm";
import { orderItems } from "@/lib/db/postgres/schema/order-items";
import { orders } from "@/lib/db/postgres/schema/orders";
import React, { useEffect, useState } from "react";

interface OrderManagementProps {
  user: {
    id: string;
    role: string;
  };
}

const OrderManagement: React.FC<OrderManagementProps> = ({ user }) => {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await db.select().from(orders);
        setOrderList(result);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrderDetails = async (orderId: string) => {
    try {
      const result = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, Number(orderId)));
      setOrderDetails(result);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des commandes</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Liste des commandes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.total} MGA</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewOrderDetails(order.id)}
                    size="sm"
                  >
                    Voir les détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {orderDetails.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Détails de la commande</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Sous-total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price} MGA</TableCell>
                  <TableCell>{item.subtotal} MGA</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
