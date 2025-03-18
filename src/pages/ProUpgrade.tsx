import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePurchases } from "@/context/PurchaseContext";
import { usePasswords } from "@/context/PasswordContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Unlock, LockKeyhole, RotateCcw, Shield, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProUpgrade: React.FC = () => {
  const { t } = useLanguage();
  const { 
    isProUser, 
    purchaseProViaStripe,
    restorePurchases, 
    isLoading, 
    currentPrice,
    isNativePlatform
  } = usePurchases();
  const { getRemainingPasswordCount } = usePasswords();
  const navigate = useNavigate();
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  
  const handlePurchase = async () => {
    if (isLoading || purchaseInProgress) return;
    
    setPurchaseInProgress(true);
    try {
      await purchaseProViaStripe();
      // Note: la redirection interrompra le flux et isProUser sera vérifié au retour
    } finally {
      setPurchaseInProgress(false);
    }
  };
  
  const handleRestore = async () => {
    if (isLoading || purchaseInProgress) return;
    
    setPurchaseInProgress(true);
    try {
      const success = await restorePurchases();
      if (success) {
        // Si la restauration est réussie, rediriger vers la page principale
        navigate("/passwords");
      }
    } finally {
      setPurchaseInProgress(false);
    }
  };
  
  const remainingCount = getRemainingPasswordCount();

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("pro.upgrade.title")}</h1>
          <p className="text-muted-foreground">{isProUser ? t("pro.upgrade.already") : t("pro.upgrade.subtitle")}</p>
        </div>
      </div>
      
      {isProUser ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("pro.active.title")}
            </CardTitle>
            <CardDescription>{t("pro.active.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>{t("pro.feature.unlimited")}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>{t("pro.feature.backup")}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>{t("pro.feature.sync")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/passwords")}>
              {t("continue")}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-destructive" />
                {t("free.plan.title")}
              </CardTitle>
              <CardDescription>{t("free.plan.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>{t("password.limit")}</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("passwords.remaining")}</span>
                  <span className={`font-semibold ${remainingCount === 0 ? "text-destructive" : ""}`}>
                    {remainingCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-primary" />
                {t("pro.plan.title")}
              </CardTitle>
              <CardDescription>{t("pro.plan.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p>{t("pro.feature.unlimited")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p>{t("pro.feature.backup")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p>{t("pro.feature.sync")}</p>
                </div>
                
                <div className="mt-6 py-3 border-t border-b">
                  <div className="flex justify-between items-center">
                    <span>{t("price")}:</span>
                    <span className="font-semibold text-lg">
                      {currentPrice.priceString}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("payment.one.time.info")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                onClick={handlePurchase}
                disabled={isLoading || purchaseInProgress}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isNativePlatform ? 
                  t("pay.once.browser") : 
                  t("pay.once.stripe")
                }
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleRestore}
                disabled={isLoading || purchaseInProgress}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("restore.purchases")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="mb-2">{t("one.time.payment.info")}</p>
        <p>{t("support.email")}</p>
      </div>
    </div>
  );
};

export default ProUpgrade;
