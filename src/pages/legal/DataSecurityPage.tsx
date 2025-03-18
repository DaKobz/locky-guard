import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdBanner from "@/components/ui/ad-banner";
import { useLanguage } from "@/context/LanguageContext";

const DataSecurityPage = () => {
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
            <CardTitle className="text-2xl">{t("data.security.page.title")}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="mb-4">
              {t("data.security.page.intro")}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("data.security.page.item1")}</li>
              <li>{t("data.security.page.item2")}</li>
              <li>{t("data.security.page.item3")}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSecurityPage;
