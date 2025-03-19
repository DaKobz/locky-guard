
import React from "react";
import { usePasswords } from "@/context/PasswordContext";
import PasswordListItem from "@/components/password/PasswordListItem";
import { Star, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Favorites: React.FC = () => {
  const { passwords } = usePasswords();
  const { t } = useLanguage();
  
  const favoritePasswords = passwords.filter((password) => password.favorite);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("favorites.title")}</h1>
        <p className="text-muted-foreground">
          {t("favorites.subtitle")}
        </p>
      </div>
      
      <div className="space-y-4">
        {favoritePasswords.length === 0 ? (
          <div className="py-12 text-center border rounded-lg bg-card">
            <span className="inline-flex mx-auto mb-4 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </span>
            <h3 className="text-lg font-medium">{t("no.favorites")}</h3>
            <p className="text-muted-foreground mt-1">
              {t("favorites.description")}
            </p>
            <Button className="mt-4" asChild>
              <Link to="/passwords">
                {t("view.all")}
              </Link>
            </Button>
          </div>
        ) : (
          favoritePasswords.map((password) => (
            <PasswordListItem key={password.id} password={password} />
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
