import React, { useState, useMemo } from "react";
import { usePasswords } from "@/context/PasswordContext";
import { usePurchases } from "@/context/PurchaseContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, SlidersHorizontal, Lock } from "lucide-react";
import PasswordListItem from "@/components/password/PasswordListItem";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const PasswordList: React.FC = () => {
  const { passwords, getRemainingPasswordCount, isLimitReached } = usePasswords();
  const { isProUser } = usePurchases();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredPasswords = useMemo(() => {
    return passwords.filter((password) => {
      const matchesSearch = 
        password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (password.website && password.website.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        categoryFilter === "all" || password.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [passwords, searchTerm, categoryFilter]);
  
  const categories = [
    { value: "all", label: t("all.categories") },
    { value: "website", label: t("website") },
    { value: "application", label: t("application") },
    { value: "banking", label: t("banking") },
    { value: "email", label: t("email") },
    { value: "social", label: t("social") },
    { value: "other", label: t("other") },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("passwords")}</h1>
          <p className="text-muted-foreground">
            {t("passwords.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link to="/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("add")}
          </Link>
        </Button>
      </div>
      
      {!isProUser && (
        <Card className="bg-muted border-primary/20">
          <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">{t("free.plan.status")}</p>
                <p className="text-sm text-muted-foreground">
                  {isLimitReached()
                    ? t("free.plan.limit.reached")
                    : t("freeplanremaining", { count: getRemainingPasswordCount() })}
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="whitespace-nowrap">
              <Link to="/pro">
                {t("upgradetopro")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="min-w-[180px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("all.categories")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredPasswords.length === 0 ? (
          <div className="py-12 text-center border rounded-lg bg-card">
            <h3 className="text-lg font-medium">{t("no.password.found")}</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || categoryFilter !== "all"
                ? t("try.other.criteria")
                : t("add.first.password")}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <Button className="mt-4" asChild>
                <Link to="/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("add.password")}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          filteredPasswords.map((password) => (
            <PasswordListItem key={password.id} password={password} />
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordList;
