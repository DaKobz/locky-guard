import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdBanner from "@/components/ui/ad-banner";
import { useLanguage } from "@/context/LanguageContext";

const LegalNoticePage = () => {
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
            <CardTitle className="text-2xl">{t("legal.notice.title")}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="mb-4">
              <strong>{t("legal.notice.editor")}</strong> {t("legal.notice.editor.value")}
            </p>
            <p className="mb-4">
              <strong>{t("legal.notice.address")}</strong> {t("legal.notice.address.value")}
            </p>
            <p className="mb-4">
              <strong>{t("legal.notice.contact")}</strong> {t("legal.notice.contact.value")}
            </p>
            <p className="mb-4">
              <strong>{t("legal.notice.director")}</strong> {t("legal.notice.director.value")}
            </p>
            <p className="mb-4">
              <strong>{t("legal.notice.hosting")}</strong> {t("legal.notice.hosting.value")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalNoticePage;
