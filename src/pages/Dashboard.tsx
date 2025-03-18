
import React from "react";
import { usePasswords } from "@/context/PasswordContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, ShieldAlert, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordListItem from "@/components/password/PasswordListItem";

const Dashboard: React.FC = () => {
  const { passwords } = usePasswords();
  const { t } = useLanguage();
  
  const favoritePasswords = passwords.filter((password) => password.favorite);
  const recentPasswords = [...passwords].sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  ).slice(0, 5);
  
  const categories = passwords.reduce<Record<string, number>>((acc, password) => {
    acc[password.category] = (acc[password.category] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className="space-y-6 max-w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("total")}</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passwords.length}</div>
            <p className="text-xs text-muted-foreground">{t("passwords.stored")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("favorites")}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoritePasswords.length}</div>
            <p className="text-xs text-muted-foreground">{t("favorite.passwords")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("last.modified")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passwords.length > 0 
                ? new Date(Math.max(...passwords.map(p => p.updatedAt.getTime()))).toLocaleDateString() 
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">{t("last.update.date")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("vulnerable")}</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">{t("passwords.at.risk")}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("recent.passwords")}</CardTitle>
            <CardDescription>{t("recent.passwords.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPasswords.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">{t("no.recent")}</p>
              ) : (
                recentPasswords.map((password) => (
                  <PasswordListItem key={password.id} password={password} />
                ))
              )}
            </div>
            {passwords.length > 5 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/passwords" 
                  className="text-sm text-primary underline underline-offset-4"
                >
                  {t("view.all.passwords")}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("categories")}</CardTitle>
            <CardDescription>{t("categories.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(categories).length === 0 ? (
                <p className="col-span-2 text-center py-4 text-muted-foreground">{t("no.category")}</p>
              ) : (
                Object.entries(categories).map(([category, count]) => (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-3 rounded-md bg-secondary"
                  >
                    <span className="capitalize">{t(category)}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
