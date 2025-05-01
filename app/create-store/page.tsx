"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"

const regions = [
  "Analamanga",
  "Vakinankaratra",
  "Itasy",
  "Bongolava",
  "Haute Matsiatra",
  "Amoron'i Mania",
  "Vatovavy",
  "Fitovinany",
  "Atsimo-Atsinanana",
]

const specialties = [
  "Légumes",
  "Fruits",
  "Céréales",
  "Épices",
  "Produits laitiers",
  "Viande",
  "Artisanat",
  "Transformation alimentaire",
]

export default function CreateStorePage() {
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Boutique créée avec succès!")
      // In a real app, we would redirect to the store page
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Créer votre boutique</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input id="storeName" placeholder="Entrez le nom de votre boutique" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Select required>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Sélectionnez votre région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" placeholder="034 xx xxx xx" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité</Label>
                <Select required>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Sélectionnez votre spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description de la boutique</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre boutique et vos produits..."
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Images de la boutique</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label htmlFor="images" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Glissez-déposez des images ici ou cliquez pour parcourir</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Détails des produits</h2>

            <div className="space-y-2">
              <Label htmlFor="productName">Nom du produit</Label>
              <Input id="productName" placeholder="Entrez le nom du produit" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (Ar)</Label>
                <Input id="price" type="number" placeholder="0" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité disponible</Label>
                <Input id="quantity" type="number" placeholder="0" min="0" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description du produit</Label>
              <Textarea
                id="productDescription"
                placeholder="Décrivez votre produit..."
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer ma boutique"}
          </Button>
        </form>
      </div>
    </div>
  )
}
