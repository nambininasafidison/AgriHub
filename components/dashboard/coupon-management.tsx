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
import { coupons } from "@/lib/db/postgres/schema/coupons";
import React, { useEffect, useState } from "react";

const CouponManagement: React.FC = () => {
  const [couponList, setCouponList] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const result = await db.select().from(coupons);
        setCouponList(result);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleAddCoupon = async () => {
    try {
      await db.insert(coupons).values(newCoupon);
      setCouponList([...couponList, newCoupon]);
      setNewCoupon({
        code: "",
        type: "percentage",
        value: 0,
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des coupons</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ajouter un coupon</h3>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Code"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Valeur"
            value={newCoupon.value}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, value: Number(e.target.value) })
            }
          />
          <Button onClick={handleAddCoupon}>Ajouter</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Liste des coupons</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Valeur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>{coupon.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CouponManagement;
