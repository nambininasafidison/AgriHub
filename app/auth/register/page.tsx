"use client";

import type React from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useNotification } from "@/components/notification-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/lib/actions/auth";
import type { UserRole } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer" as UserRole,
    region: "",
    specialty: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();
  const { addNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("confirmPassword", formData.confirmPassword);
      form.append("role", formData.role);
      form.append("region", formData.region);
      form.append("specialty", formData.specialty);

      const result = await register(form);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.user) {
        setUser(result.user);
        addNotification({
          title: "Compte créé",
          message: "Votre compte a été créé avec succès!",
          type: "success",
        });
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  // Show additional fields based on role
  const showFarmerFields = formData.role === "farmer";
  const showSupplierFields = formData.role === "supplier";

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour créer votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre type de compte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Agriculteur / Artisan</SelectItem>
                  <SelectItem value="buyer">Acheteur</SelectItem>
                  <SelectItem value="supplier">
                    Fournisseur d'intrants
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional fields based on role */}
            {(showFarmerFields || showSupplierFields) && (
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="Votre région"
                  value={formData.region}
                  onChange={handleChange}
                />
              </div>
            )}

            {(showFarmerFields || showSupplierFields) && (
              <div className="space-y-2">
                <Label htmlFor="specialty">
                  {showFarmerFields
                    ? "Spécialité agricole"
                    : "Type de produits fournis"}
                </Label>
                <Input
                  id="specialty"
                  name="specialty"
                  placeholder={
                    showFarmerFields
                      ? "Ex: Épices, Fruits, etc."
                      : "Ex: Semences, Engrais, etc."
                  }
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Vous avez déjà un compte?{" "}
            <Link href="/auth/login" className="text-green-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
