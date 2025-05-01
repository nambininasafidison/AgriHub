"use client";

import type React from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useNotification } from "@/components/notification-provider";
import { Button } from "@/components/ui/button";
import {
  addProductReview,
  deleteProductReview,
  updateProductReview,
} from "@/lib/actions/products";
import type { Review } from "@/lib/types";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export default function ProductReviews({
  productId,
  rating,
  reviewCount,
  reviews,
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();

  const filteredReviews = activeFilter
    ? reviews.filter((review) => review.rating === activeFilter)
    : reviews;

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await deleteProductReview(reviewId);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Avis supprimé",
          message: "Votre avis a été supprimé avec succès",
          type: "success",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression de l'avis",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = async (
    reviewId: string,
    updatedReview: { rating: number; comment: string }
  ) => {
    setIsSubmitting(true);

    try {
      const result = await updateProductReview(reviewId, updatedReview);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Avis modifié",
          message: "Votre avis a été modifié avec succès",
          type: "success",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'avis :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la modification de l'avis",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm("Êtes-vous sûr de vouloir soumettre cet avis ?")) {
      return;
    }

    if (!user) {
      router.push(`/auth/login?redirect=/product/${productId}`);
      return;
    }

    if (newReview.rating === 0) {
      addNotification({
        title: "Erreur",
        message: "Veuillez attribuer une note",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("userId", user.id);
      formData.append("userName", user.name);
      formData.append("rating", newReview.rating.toString());
      formData.append("comment", newReview.comment);

      const result = await addProductReview(formData);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
      } else {
        addNotification({
          title: "Avis ajouté",
          message: "Votre avis a été ajouté avec succès",
          type: "success",
        });
        setNewReview({ rating: 0, comment: "" });
        setShowReviewForm(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de l'ajout de votre avis",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 mt-1">{reviewCount} avis</span>
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-2">{star}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${
                        (reviews.filter((review) => review.rating === star)
                          .length /
                          (reviews.length || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(null)}
          >
            Tous
          </Button>
          {[5, 4, 3, 2, 1].map((star) => (
            <Button
              key={star}
              variant={activeFilter === star ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(star)}
            >
              {star} <Star className="h-3 w-3 ml-1" />
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? "Masquer le formulaire" : "Écrire un avis"}
        </Button>
      </div>

      {showReviewForm && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Laisser un avis</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <p className="mb-2">Votre note</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2">Votre commentaire</p>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Partagez votre expérience avec ce produit..."
                className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Soumettre l'avis"}
            </Button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="pb-4 border-b last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleEditReview(review.id, {
                      rating: review.rating,
                      comment: review.comment,
                    })
                  }
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Aucun avis ne correspond à ce filtre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
