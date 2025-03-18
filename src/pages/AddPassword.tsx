import React, { useState, useEffect } from "react";
import { usePasswords } from "@/context/PasswordContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePurchases } from "@/context/PurchaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Save, ArrowLeft, RefreshCw, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AddPassword: React.FC = () => {
  const { addPassword, generatePassword, isLimitReached, getRemainingPasswordCount } = usePasswords();
  const { isProUser } = usePurchases();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLimitReached() && !isProUser) {
      navigate("/pro");
    }
  }, [isLimitReached, isProUser, navigate]);
  
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "website" as const,
    notes: "",
    favorite: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const categories = [
    { value: "website", label: t("website") },
    { value: "application", label: t("application") },
    { value: "banking", label: t("banking") },
    { value: "email", label: t("email") },
    { value: "social", label: t("social") },
    { value: "other", label: t("other") },
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as any }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, favorite: checked }));
  };
  
  const generateNewPassword = () => {
    const newPassword = generatePassword(16, true, true, true);
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLimitReached() && !isProUser) {
      navigate("/pro");
      return;
    }
    
    const success = addPassword(formData);
    if (success) {
      navigate("/passwords");
    }
  };
  
  if (isLimitReached() && !isProUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("limit.reached.title")}</h1>
            <p className="text-muted-foreground">
              {t("limit.reached.subtitle")}
            </p>
          </div>
        </div>
        
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t("upgrade.required")}
            </CardTitle>
            <CardDescription>
              {t("upgrade.required.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t("password.limit.reached.desc")}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/pro")}>
              {t("upgrade.now")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("add.password.title")}</h1>
          <p className="text-muted-foreground">
            {t("add.password.subtitle")}
          </p>
        </div>
      </div>
      
      {!isProUser && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm flex items-center">
            <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
            {isLimitReached() 
              ? t("free.plan.limit.reached")
              : t("freeplanremaining", { count: getRemainingPasswordCount() })}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")} <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              name="title"
              placeholder={t("title.placeholder")}
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">{t("category")} <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
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
          
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")} <span className="text-destructive">*</span></Label>
            <Input
              id="username"
              name="username"
              placeholder={t("username.placeholder")}
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">{t("website.url")}</Label>
            <Input
              id="website"
              name="website"
              placeholder={t("website.placeholder")}
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">{t("password")} <span className="text-destructive">*</span></Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={generateNewPassword}
              >
                <RefreshCw className="h-3 w-3" />
                {t("generate")}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("password.placeholder")}
                value={formData.password}
                onChange={handleInputChange}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="favorite">{t("mark.favorite")}</Label>
              <Switch
                id="favorite"
                checked={formData.favorite}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">{t("notes")}</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder={t("notes.placeholder")}
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            {t("cancel")}
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPassword;
