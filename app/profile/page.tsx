import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserActivity, getUserProfile } from "@/lib/actions/users";

export default async function ProfilePage() {
  const user = await getSession();

  if (!user) {
    redirect("/auth/login?redirect=/profile");
  }

  const userProfile = await getUserProfile(user.id);

  const userActivity = await getUserActivity(user.id);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={userProfile?.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {user.role === "farmer"
                  ? "Agriculteur"
                  : user.role === "buyer"
                  ? "Acheteur"
                  : user.role === "supplier"
                  ? "Fournisseur"
                  : "Admin"}
              </div>

              <div className="w-full mt-6 space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres du compte
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Mes commandes
                  </Link>
                </Button>
                {(user.role === "farmer" ||
                  user.role === "supplier" ||
                  user.role === "admin") && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/dashboard">
                      <Store className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos informations de base</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Nom complet
                  </dt>
                  <dd className="text-sm col-span-2">
                    {userProfile?.name || user.name}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm col-span-2">{user.email}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Type de compte
                  </dt>
                  <dd className="text-sm col-span-2">
                    {user.role === "farmer"
                      ? "Agriculteur"
                      : user.role === "buyer"
                      ? "Acheteur"
                      : user.role === "supplier"
                      ? "Fournisseur"
                      : "Admin"}
                  </dd>
                </div>
                {userProfile?.phone && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Téléphone
                    </dt>
                    <dd className="text-sm col-span-2">{userProfile.phone}</dd>
                  </div>
                )}
                {userProfile?.region && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Région
                    </dt>
                    <dd className="text-sm col-span-2">{userProfile.region}</dd>
                  </div>
                )}
                {userProfile?.specialty && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Spécialité
                    </dt>
                    <dd className="text-sm col-span-2">
                      {userProfile.specialty}
                    </dd>
                  </div>
                )}
                {userProfile?.memberSince && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Membre depuis
                    </dt>
                    <dd className="text-sm col-span-2">
                      {new Date(userProfile.memberSince).toLocaleDateString(
                        "fr-FR"
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Vos dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userActivity && userActivity.length > 0 ? (
                <div className="space-y-4">
                  {userActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        {activity.type === "order" ? (
                          <ShoppingBag className="h-4 w-4 text-gray-500" />
                        ) : (
                          <User className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Aucune activité récente à afficher.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
