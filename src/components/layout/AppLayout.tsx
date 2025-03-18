
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LoginPage from "@/pages/LoginPage";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdBanner from "@/components/ui/ad-banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background safe-area-padding">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <AdBanner />
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden safe-area-padding safe-area-bottom">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
