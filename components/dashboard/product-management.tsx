"use client";

import { useNotification } from "@/components/notification-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "@/lib/actions/products";
import type { Product, User } from "@/lib/types";
import { useEffect, useState } from "react";

interface ProductManagementProps {
  user: User;
}

export default function ProductManagement({ user }: ProductManagementProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    salePrice: 0,
    category: "",
    subcategory: "",
    stock: 0,
    image: "/placeholder.svg?height=400&width=400",
    featured: false,
    isNew: true,
    onSale: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        const filteredProducts: Product[] =
          user.role === "admin"
            ? productsData
            : productsData.filter((p: Product) => p.sellerId === user.id);

        setProducts(filteredProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load products:", error);
        addNotification({
          title: "Erreur",
          message: "Impossible de charger les produits",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, addNotification]);

  const handleAddProduct = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price.toString());
      formData.append("category", newProduct.category);
      formData.append("subcategory", newProduct.subcategory);
      formData.append("stock", newProduct.stock.toString());
      formData.append("image", newProduct.image);
      formData.append("featured", newProduct.featured.toString());
      formData.append("isNew", newProduct.isNew.toString());
      formData.append("onSale", newProduct.onSale.toString());

      if (newProduct.onSale && newProduct.salePrice > 0) {
        formData.append("salePrice", newProduct.salePrice.toString());
      }

      const result = await createProduct(formData);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Produit ajouté",
          message: `${newProduct.name} a été ajouté avec succès`,
          type: "success",
        });

        setProducts([...products, result.product]);
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          salePrice: 0,
          category: "",
          subcategory: "",
          stock: 0,
          image: "/placeholder.svg?height=400&width=400",
          featured: false,
          isNew: true,
          onSale: false,
        });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de l'ajout du produit",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    if (!currentProduct) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", currentProduct.id);
      formData.append("name", currentProduct.name);
      formData.append("description", currentProduct.description);
      formData.append("price", currentProduct.price.toString());
      formData.append("category", currentProduct.category);
      formData.append("subcategory", currentProduct.subcategory || "");
      formData.append("stock", currentProduct.stock.toString());
      formData.append("image", currentProduct.image);
      formData.append("featured", currentProduct.featured.toString());
      formData.append("isNew", currentProduct.isNew.toString());
      formData.append("onSale", currentProduct.onSale.toString());

      if (currentProduct.onSale && currentProduct.salePrice > 0) {
        formData.append("salePrice", currentProduct.salePrice.toString());
      }

      const result = await updateProduct(formData);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Produit mis à jour",
          message: `${currentProduct.name} a été mis à jour avec succès`,
          type: "success",
        });

        setProducts(
          products.map((p) => (p.id === currentProduct.id ? result.product : p))
        );
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour du produit",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    setIsSubmitting(true);

    try {
      const result = await deleteProduct(currentProduct.id);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Produit supprimé",
          message: `${currentProduct.name} a été supprimé avec succès`,
          type: "success",
        });

        setProducts(products.filter((p) => p.id !== currentProduct.id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression du produit",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des produits</h2>

      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Ajouter un produit
      </Button>

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
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  {isSubmitting ? "Chargement..." : "Supprimer"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nom"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Prix"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Catégorie"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProduct} disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nom"
              value={currentProduct?.name || ""}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Prix"
              value={currentProduct?.price || 0}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  price: Number(e.target.value),
                })
              }
            />
            <Input
              placeholder="Catégorie"
              value={currentProduct?.category || ""}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  category: e.target.value,
                })
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditProduct} disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer {currentProduct?.name} ?</p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : " Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
