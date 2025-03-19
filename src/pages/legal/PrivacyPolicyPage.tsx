import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdBanner from "@/components/ui/ad-banner";
import { useLanguage } from "@/context/LanguageContext";

const PrivacyPolicyPage = () => {
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
            <CardTitle className="text-2xl">{t("privacy.policy.title")}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p>
              {t("privacy.policy.intro")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("privacy.data.collection.title")}</h3>
            <p>
              {t("privacy.data.collection.text")}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("privacy.data.collection.item1")}</li>
              <li>{t("privacy.data.collection.item2")}</li>
            </ul>
            <p>
              {t("privacy.data.collection.encryption")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("privacy.storage.title")}</h3>
            <p>
              {t("privacy.storage.text")}
            </p>
            
            <h3 className="text-lg font-semibold mt-6">{t("privacy.security.title")}</h3>
            <p>
              {t("privacy.security.text")}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("privacy.security.item1")}</li>
              <li>{t("privacy.security.item2")}</li>
              <li>{t("privacy.security.item3")}</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6">{t("privacy.rights.title")}</h3>
            <p>
              {t("privacy.rights.text")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
