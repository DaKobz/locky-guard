
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Lock, Home, Star, PlusCircle, Shield, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t("dashboard"), path: "/", icon: Home },
    { name: t("all.passwords"), path: "/passwords", icon: Key },
    { name: t("favorites.title"), path: "/favorites", icon: Star },
    { name: t("generator"), path: "/generator", icon: Shield },
    { name: t("backup"), path: "/backup", icon: Save },
  ];

  return (
    <aside className="w-full md:w-64 border-r bg-card flex-shrink-0">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-2 py-4">
          <Lock className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">{t("app.name")}</span>
        </div>
        
        <Button asChild variant="default" className="mt-4 mb-8">
          <Link to="/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("add.password")}
          </Link>
        </Button>
        
        <nav className="space-y-1 mt-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {t("data.secure")}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
