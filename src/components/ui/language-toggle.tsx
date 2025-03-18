import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="px-2 h-8"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      {language === "fr" ? "EN" : "FR"}
    </Button>
  );
}
