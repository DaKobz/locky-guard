import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Moon, 
  Sun, 
  HelpCircle,
  Check
} from "lucide-react";

const SetupPasswordPage: React.FC = () => {
  const { t, setLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { setMasterPassword, isFirstLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Vérifier si l'utilisateur est déjà authentifié
  useEffect(() => {
    // Si l'utilisateur a déjà configuré un mot de passe, rediriger vers le tableau de bord
    if (isAuthenticated && !isFirstLogin) {
      navigate("/dashboard");
    }
  }, [isFirstLogin, isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (password.length < 6) {
      toast.error(t("password.too.short"));
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("password.mismatch"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enregistrer le mot de passe
      const success = await setMasterPassword(password);
      
      if (success) {
        // Rediriger vers le tableau de bord après la création du mot de passe
        // Forcer un court délai pour s'assurer que le state est bien mis à jour
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      toast.error(t("password.creation.error"));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour changer le thème
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Header avec les boutons de langue, thème et aide */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {/* Sélecteur de langue */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("fr")} className="flex items-center justify-between">
              Français {language === "fr" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center justify-between">
              English {language === "en" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bouton de thème */}
        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Bouton d'aide/information légale */}
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link to="/legal">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("app.name")}</h1>
          <p className="text-muted-foreground">{t("create.master.password.description")}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("new.master.password")}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder={t("master.password.placeholder")}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t("confirm.master.password")}
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                placeholder={t("confirm.master.password")}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("creating") : t("create.and.unlock")}
          </Button>
        </form>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>{t("master.password.warning")}</p>
          <p className="mt-2">
            <Link to="/legal" className="underline hover:text-primary">
              {t("legal.information")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPasswordPage; 