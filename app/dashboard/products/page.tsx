import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/actions/auth";
import { getProducts } from "@/lib/actions/products";
import { redirect } from "next/navigation";

const ProductsPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const products = await getProducts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price} MGA</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Modifier
                </Button>
                <Button size="sm" variant="destructive" className="ml-2">
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsPage;
