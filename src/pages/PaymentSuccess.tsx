import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePurchases } from "@/context/PurchaseContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

// URL de votre backend Stripe Firebase
const STRIPE_PAYMENT_URL = 'https://us-central1-VOTRE_PROJET_ID.cloudfunctions.net/checkPayment';

const PaymentSuccess: React.FC = () => {
  const { t } = useLanguage();
  const { initializePurchases, isProUser } = usePurchases();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Traiter le paiement au chargement de la page
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setError("Informations de paiement manquantes");
        setIsProcessing(false);
        return;
      }

      try {
        // Appeler l'API pour vérifier le paiement
        const response = await fetch(`${STRIPE_PAYMENT_URL}?session_id=${sessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          // Mettre à jour le statut Pro localement
          localStorage.setItem("locky_pro_purchased", "true");
          await initializePurchases(); // Recharger le statut Pro
        } else {
          setError(data.message || "Le paiement n'a pas été confirmé");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement", error);
        setError("Une erreur est survenue lors de la vérification du paiement");
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
    
    // Nettoyer l'URL des paramètres de requête
    return () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    };
  }, [searchParams, initializePurchases]);

  const handleContinue = () => {
    navigate("/passwords");
  };

  return (
    <div className="container mx-auto py-12 max-w-lg">
      <Card className="border-primary/30">
        <CardHeader className="text-center">
          {isProcessing ? (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <CardTitle>{t("payment.processing")}</CardTitle>
              <CardDescription>{t("payment.wait")}</CardDescription>
            </>
          ) : error ? (
            <>
              <CardTitle className="text-destructive">{t("payment.error.title")}</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle>{t("payment.success.title")}</CardTitle>
              <CardDescription>{t("payment.success.desc")}</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {!isProcessing && !error && (
            <div className="space-y-4 py-4">
              <p className="text-center">
                {t("payment.success.unlimited")}
              </p>
              <div className="flex justify-center">
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t("pro.active.badge")}
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">
                {t("payment.error.desc")}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={isProcessing}
            className="w-full md:w-auto"
          >
            {error 
              ? t("payment.error.retry") 
              : t("payment.success.continue")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess; 