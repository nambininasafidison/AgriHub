"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import { useNotification } from "@/components/notification-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCart } from "@/lib/actions/cart";
import { getWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/wishlist");
      return;
    }

    const loadWishlist = async () => {
      try {
        const items = await getWishlist();
        setWishlist(items);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        addNotification({
          title: "Erreur",
          message: "Impossible de charger votre liste de favoris",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, router, addNotification]);

  const handleRemove = async (itemId: string) => {
    setActionInProgress(itemId);
    try {
      await removeFromWishlist(itemId);

      setWishlist(wishlist.filter((item) => item.id !== itemId));
      addNotification({
        title: "Produit retiré",
        message: "Le produit a été retiré de vos favoris",
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression du produit",
        type: "error",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.product) {
      addNotification({
        title: "Erreur",
        message: "Informations produit manquantes",
        type: "error",
      });
      return;
    }

    setActionInProgress(item.id);
    try {
      const cartFormData = new FormData();
      cartFormData.append("productId", item.product.id);
      cartFormData.append("name", item.product.name);
      cartFormData.append("price", item.product.price.toString());
      cartFormData.append("quantity", "1");
      cartFormData.append("image", item.product.image || "/placeholder.svg");

      if (item.product.category) {
        cartFormData.append("category", item.product.category);
      }

      if (item.product.seller) {
        cartFormData.append("seller", item.product.seller);
      }

      const cartResult = await addToCart(cartFormData);

      if (cartResult.error) {
        addNotification({
          title: "Erreur",
          message: cartResult.error,
          type: "error",
        });
        return;
      }

      await removeFromWishlist(item.id);
      setWishlist(wishlist.filter((i) => i.id !== item.id));
      addNotification({
        title: "Produit ajouté au panier",
        message: "Le produit a été ajouté au panier et retiré des favoris",
        type: "success",
      });
      await refreshCart();
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue",
        type: "error",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mes Favoris</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Votre liste de favoris est vide
          </h2>
          <p className="text-gray-500 mb-6">
            Ajoutez des produits à vos favoris pour les retrouver facilement
            plus tard
          </p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <Link href={`/product/${item.product.id}`}>
                <div className="bg-gray-100 p-4 flex items-center justify-center h-48">
                  <Image
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name || "Produit"}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-medium mb-2 hover:text-green-600 transition-colors">
                    {item.product?.name || "Produit non disponible"}
                  </h3>
                </Link>
                <p className="font-bold mb-4">
                  {item.product?.price?.toLocaleString() || "N/A"} Ar
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1"
                    disabled={actionInProgress === item.id || !item.product}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    disabled={actionInProgress === item.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
