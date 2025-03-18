import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdBanner from "@/components/ui/ad-banner";
import { useLanguage } from "@/context/LanguageContext";

const TermsOfServicePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdBanner />
      
      <div className="flex-1 container mx-auto p-4 pt-10">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate("/legal")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> {t("back")}
        </Button>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{t("terms.title")}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <h3 className="text-lg font-semibold mt-2">{t("terms.acceptance.title")}</h3>
            <p>
              {t("terms.acceptance.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("terms.description.title")}</h3>
            <p>
              {t("terms.description.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("terms.usage.title")}</h3>
            <p>
              {t("terms.usage.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("terms.ip.title")}</h3>
            <p>
              {t("terms.ip.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("terms.liability.title")}</h3>
            <p>
              {t("terms.liability.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("terms.changes.title")}</h3>
            <p>
              {t("terms.changes.text")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
