"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { verifyEmail } from "@/lib/actions/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
      verifyEmailToken(emailParam, tokenParam);
    } else {
      setError("Lien de vérification invalide");
      setIsLoading(false);
    }
  }, [searchParams]);

  const verifyEmailToken = async (email: string, token: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);

      const result = await verifyEmail(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);

        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la vérification de votre email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Vérification de l'email
          </CardTitle>
          <CardDescription>Nous vérifions votre adresse email</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-green-500 animate-spin mb-4" />
              <p>Vérification en cours...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Échec de la vérification
              </h3>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <p className="text-gray-500 mb-4">
                Le lien de vérification est invalide ou a expiré. Veuillez
                demander un nouveau lien de vérification.
              </p>
              <Button asChild>
                <Link href="/auth/login">Retour à la connexion</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email vérifié!</h3>
              <p className="text-gray-500 mb-4">
                Votre adresse email a été vérifiée avec succès. Vous pouvez
                maintenant profiter pleinement de notre plateforme.
              </p>
              <p className="text-sm text-gray-500">
                Vous allez être redirigé vers la page d'accueil dans quelques
                secondes...
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            Retour à l'accueil
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
