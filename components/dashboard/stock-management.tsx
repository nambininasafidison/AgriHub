"use client";

import { useNotification } from "@/components/notification-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateProductStock } from "@/lib/actions/stock";
import type { User } from "@/lib/types";
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const stockItems = [
  {
    id: "1",
    name: "Vanille Premium de Madagascar",
    category: "Épices",
    quantity: 45,
    unit: "kg",
    price: 120000,
    status: "En stock",
  },
  {
    id: "2",
    name: "Café Arabica Bio",
    category: "Boissons",
    quantity: 78,
    unit: "kg",
    price: 45000,
    status: "En stock",
  },
  {
    id: "3",
    name: "Girofle de Qualité Export",
    category: "Épices",
    quantity: 5,
    unit: "kg",
    price: 28000,
    status: "Stock faible",
  },
  {
    id: "4",
    name: "Litchi Séché Naturel",
    category: "Fruits",
    quantity: 0,
    unit: "kg",
    price: 12000,
    status: "Rupture de stock",
  },
  {
    id: "5",
    name: "Poivre Sauvage de Voatsiperifery",
    category: "Épices",
    quantity: 23,
    unit: "kg",
    price: 35000,
    status: "En stock",
  },
];

interface StockManagementProps {
  user: User;
}

export default function StockManagement({ user }: StockManagementProps) {
  const [items, setItems] = useState(stockItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<(typeof stockItems)[0] | null>(
    null
  );
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "kg",
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleAddItem = () => {
    if (
      !newItem.name ||
      !newItem.category ||
      newItem.quantity <= 0 ||
      newItem.price <= 0
    ) {
      addNotification({
        title: "Erreur",
        message: "Veuillez remplir tous les champs correctement.",
        type: "error",
      });
      return;
    }

    const item = {
      id: `${Date.now()}`,
      ...newItem,
      status:
        newItem.quantity > 10
          ? "En stock"
          : newItem.quantity > 0
          ? "Stock faible"
          : "Rupture de stock",
    };
    setItems([...items, item]);
    setNewItem({
      name: "",
      category: "",
      quantity: 0,
      unit: "kg",
      price: 0,
    });
    setIsAddDialogOpen(false);

    addNotification({
      title: "Produit ajouté",
      message: `${item.name} a été ajouté à votre inventaire`,
      type: "success",
    });
  };

  const handleEditItem = async () => {
    if (!currentItem || currentItem.quantity < 0 || currentItem.price <= 0) {
      addNotification({
        title: "Erreur",
        message: "Veuillez vérifier les informations du produit.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", currentItem.id);
      formData.append("stock", currentItem.quantity.toString());

      const result = await updateProductStock(
        currentItem.id,
        currentItem.quantity
      );

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        const updatedItems = items.map((item) => {
          if (item.id === currentItem.id) {
            return {
              ...currentItem,
              status:
                currentItem.quantity > 10
                  ? "En stock"
                  : currentItem.quantity > 0
                  ? "Stock faible"
                  : "Rupture de stock",
            };
          }
          return item;
        });

        setItems(updatedItems);
        setIsEditDialogOpen(false);

        addNotification({
          title: "Stock mis à jour",
          message: `Le stock de ${currentItem.name} a été mis à jour`,
          type: "success",
        });

        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour du stock",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;

    const updatedItems = items.filter((item) => item.id !== currentItem.id);
    setItems(updatedItems);
    setIsDeleteDialogOpen(false);

    addNotification({
      title: "Produit supprimé",
      message: `${currentItem.name} a été supprimé de votre inventaire`,
      type: "success",
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">Gestion des stocks</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter un nouveau produit à
                votre inventaire.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="name"
                  className="text-sm font-medium sm:text-right"
                >
                  Nom
                </label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="category"
                  className="text-sm font-medium sm:text-right"
                >
                  Catégorie
                </label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium sm:text-right"
                >
                  Quantité
                </label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="unit"
                  className="text-sm font-medium sm:text-right"
                >
                  Unité
                </label>
                <Select
                  value={newItem.unit}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, unit: value })
                  }
                >
                  <SelectTrigger className="sm:col-span-3">
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                    <SelectItem value="g">Gramme (g)</SelectItem>
                    <SelectItem value="l">Litre (l)</SelectItem>
                    <SelectItem value="unité">Unité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="price"
                  className="text-sm font-medium sm:text-right"
                >
                  Prix (Ar)
                </label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: Number(e.target.value) })
                  }
                  className="sm:col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button onClick={handleAddItem} className="w-full sm:w-auto">
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead className="hidden md:table-cell">
                Prix unitaire
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {item.category}
                </TableCell>
                <TableCell>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.price.toLocaleString()} Ar
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "En stock"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Stock faible"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={isEditDialogOpen && currentItem?.id === item.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setCurrentItem(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Modifier le produit</DialogTitle>
                          <DialogDescription>
                            Modifiez les informations du produit.
                          </DialogDescription>
                        </DialogHeader>
                        {currentItem && (
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                              <label
                                htmlFor="edit-name"
                                className="text-sm font-medium sm:text-right"
                              >
                                Nom
                              </label>
                              <Input
                                id="edit-name"
                                value={currentItem.name}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    name: e.target.value,
                                  })
                                }
                                className="sm:col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                              <label
                                htmlFor="edit-category"
                                className="text-sm font-medium sm:text-right"
                              >
                                Catégorie
                              </label>
                              <Input
                                id="edit-category"
                                value={currentItem.category}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    category: e.target.value,
                                  })
                                }
                                className="sm:col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                              <label
                                htmlFor="edit-quantity"
                                className="text-sm font-medium sm:text-right"
                              >
                                Quantité
                              </label>
                              <Input
                                id="edit-quantity"
                                type="number"
                                value={currentItem.quantity}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    quantity: Number(e.target.value),
                                  })
                                }
                                className="sm:col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                              <label
                                htmlFor="edit-unit"
                                className="text-sm font-medium sm:text-right"
                              >
                                Unité
                              </label>
                              <Input
                                id="edit-unit"
                                value={currentItem.unit}
                                className="sm:col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                              <label
                                htmlFor="edit-price"
                                className="text-sm font-medium sm:text-right"
                              >
                                Prix (Ar)
                              </label>
                              <Input
                                id="edit-price"
                                type="number"
                                value={currentItem.price}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    price: Number(e.target.value),
                                  })
                                }
                                className="sm:col-span-3"
                                disabled
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={handleEditItem}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                          >
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isDeleteDialogOpen && currentItem?.id === item.id}
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);
                        if (!open) setCurrentItem(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentItem(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Supprimer le produit</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce produit? Cette
                            action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex items-center p-4 bg-red-50 rounded-md">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-500">
                              Cette action supprimera définitivement le produit
                              "{currentItem?.name}" de votre inventaire.
                            </p>
                          </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Annuler
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteItem}
                            className="w-full sm:w-auto"
                          >
                            Supprimer
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
