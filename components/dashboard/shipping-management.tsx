import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db/postgres/connection";
import { shippingMethods } from "@/lib/db/postgres/schema/shipping";
import React, { useEffect, useState } from "react";

const ShippingManagement: React.FC = () => {
  const [shippingList, setShippingList] = useState<any[]>([]);
  const [newShipping, setNewShipping] = useState({
    name: "",
    price: 0,
    estimatedDeliveryTime: "",
  });

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const result = await db.select().from(shippingMethods);
        setShippingList(result);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      }
    };

    fetchShippingMethods();
  }, []);

  const handleAddShipping = async () => {
    try {
      await db.insert(shippingMethods).values(newShipping);
      setShippingList([...shippingList, newShipping]);
      setNewShipping({ name: "", price: 0, estimatedDeliveryTime: "" });
    } catch (error) {
      console.error("Error adding shipping method:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion de la livraison</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Ajouter une méthode de livraison
        </h3>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nom"
            value={newShipping.name}
            onChange={(e) =>
              setNewShipping({ ...newShipping, name: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Prix"
            value={newShipping.price}
            onChange={(e) =>
              setNewShipping({ ...newShipping, price: Number(e.target.value) })
            }
          />
          <Input
            placeholder="Délai de livraison estimé"
            value={newShipping.estimatedDeliveryTime}
            onChange={(e) =>
              setNewShipping({
                ...newShipping,
                estimatedDeliveryTime: e.target.value,
              })
            }
          />
          <Button onClick={handleAddShipping}>Ajouter</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Liste des méthodes de livraison
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Délai estimé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shippingList.map((method, index) => (
              <TableRow key={index}>
                <TableCell>{method.name}</TableCell>
                <TableCell>{method.price} MGA</TableCell>
                <TableCell>{method.estimatedDeliveryTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShippingManagement;
