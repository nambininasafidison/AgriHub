"use client";

import type React from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useNotification } from "@/components/notification-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    region: "",
    specialty: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productUpdates: true,
  });

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        region: user.region || "",
        specialty: user.specialty || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login?redirect=/settings");
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      addNotification({
        title: "Profil mis à jour",
        message: "Vos informations ont été mises à jour avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      addNotification({
        title: "Erreur",
        message: "Une erreur s'est produite lors de la mise à jour du profil",
        type: "error",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        title: "Erreur",
        message: "Les mots de passe ne correspondent pas",
        type: "error",
      });
      return;
    }

    setIsPasswordLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      addNotification({
        title: "Mot de passe mis à jour",
        message: "Votre mot de passe a été mis à jour avec succès",
        type: "success",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      addNotification({
        title: "Erreur",
        message:
          "Une erreur s'est produite lors de la mise à jour du mot de passe",
        type: "error",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotificationLoading(true);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationSettings),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification preferences");
      }

      addNotification({
        title: "Préférences mises à jour",
        message: "Vos préférences de notification ont été mises à jour",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      addNotification({
        title: "Erreur",
        message:
          "Une erreur s'est produite lors de la mise à jour des préférences",
        type: "error",
      });
    } finally {
      setIsNotificationLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Mot de passe</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input
                    id="region"
                    value={profileData.region}
                    onChange={(e) =>
                      setProfileData({ ...profileData, region: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Spécialité</Label>
                  <Input
                    id="specialty"
                    value={profileData.specialty}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        specialty: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading
                    ? "Mise à jour..."
                    : "Mettre à jour le mot de passe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderUpdates">
                        Mises à jour des commandes
                      </Label>
                      <p className="text-sm text-gray-500">
                        Recevez des notifications sur l'état de vos commandes
                      </p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orderUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions">Promotions et offres</Label>
                      <p className="text-sm text-gray-500">
                        Recevez des notifications sur les promotions et offres
                        spéciales
                      </p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={notificationSettings.promotions}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          promotions: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-gray-500">
                        Recevez notre newsletter mensuelle
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notificationSettings.newsletter}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newsletter: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="productUpdates">
                        Mises à jour des produits
                      </Label>
                      <p className="text-sm text-gray-500">
                        Recevez des notifications sur les nouveaux produits
                      </p>
                    </div>
                    <Switch
                      id="productUpdates"
                      checked={notificationSettings.productUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          productUpdates: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isNotificationLoading}>
                  {isNotificationLoading
                    ? "Enregistrement..."
                    : "Enregistrer les préférences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
