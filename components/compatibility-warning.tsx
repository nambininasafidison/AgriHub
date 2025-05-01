"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { detectBrowserCompatibility } from "@/lib/utils/browser-compatibility";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function CompatibilityWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<any>(null);

  useEffect(() => {
    const compatibility = detectBrowserCompatibility();
    setBrowserInfo(compatibility);

    if (!compatibility.compatible) {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning || !browserInfo) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Problème de compatibilité détecté</AlertTitle>
      <AlertDescription>
        Votre navigateur ({browserInfo.browser}) pourrait ne pas prendre en
        charge toutes les fonctionnalités de cette application. Pour une
        meilleure expérience, veuillez utiliser une version récente de Chrome,
        Firefox, Safari ou Edge.
      </AlertDescription>
    </Alert>
  );
}
