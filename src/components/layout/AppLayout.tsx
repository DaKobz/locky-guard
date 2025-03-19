import React from "react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdBanner from "@/components/ui/ad-banner";

const AppLayout = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <AdBanner />
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden safe-area-padding safe-area-bottom">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
