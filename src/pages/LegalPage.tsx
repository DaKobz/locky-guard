import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Scale, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AdBanner from "@/components/ui/ad-banner";

const LegalPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdBanner />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Button 
          variant="ghost" 
          className="absolute top-16 left-4"
          onClick={() => navigate("/passwords")}
        >
          ← {t("back")}
        </Button>
        
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-center mb-8">{t("legal.information")}</h1>
          
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={() => navigate("/legal/privacy")}
          >
            <Shield className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">{t("privacy")}</div>
              <div className="text-sm text-muted-foreground">{t("legal.privacy")}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={() => navigate("/legal/terms")}
          >
            <FileText className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">{t("terms")}</div>
              <div className="text-sm text-muted-foreground">{t("legal.terms")}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={() => navigate("/legal/notice")}
          >
            <Scale className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">{t("legal.notice")}</div>
              <div className="text-sm text-muted-foreground">{t("legal.legal")}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={() => navigate("/legal/security")}
          >
            <Lock className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">{t("data.security.title")}</div>
              <div className="text-sm text-muted-foreground">{t("legal.security")}</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
