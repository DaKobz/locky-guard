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
  Shield, 
  Eye, 
  EyeOff, 
  Globe, 
  Moon, 
  Sun, 
  HelpCircle,
  Check
} from "lucide-react";
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const LoginPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { login, isFirstLogin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Vérifier si nous sommes sur une plateforme native
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log("Plateforme native détectée (Capacitor)");
      
      // À chaque fois que l'application devient active
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log("Application active - Authentification forcée");
          // Forcer la réinitialisation de l'état d'authentification
          localStorage.setItem("forceLogout", "true");
          if (isAuthenticated) {
            navigate("/login");
          }
        }
      });
      
      // Nettoyer les écouteurs lors du démontage
      return () => {
        App.removeAllListeners();
      };
    }
  }, []);

  // Vérifier si l'utilisateur doit être redirigé
  useEffect(() => {
    if (!isLoading) {
      // Si c'est une première connexion, rediriger vers la page de création de mot de passe
      if (isFirstLogin) {
        navigate("/setup");
      }
      // Si déjà authentifié, rediriger vers le tableau de bord
      else if (isAuthenticated) {
        navigate("/dashboard");
      }
      
      // Forcer le localStorage à définir isAuthenticated comme false
      if (!isAuthenticated && !isFirstLogin) {
        localStorage.setItem('isAuthenticated', 'false');
        console.log("État d'authentification réinitialisé dans LoginPage");
      }
    }
  }, [isFirstLogin, isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error(t("password.required"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Tentative de connexion
      const success = await login(password);
      
      if (success) {
        // Rediriger vers le tableau de bord après la connexion
        navigate("/dashboard");
      } else {
        toast.error(t("login.failed"));
      }
    } catch (error) {
      toast.error(t("login.error"));
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

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("app.name")}</h1>
          <p className="text-muted-foreground">{t("login.description")}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("main.password")}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder={t("main.password")}
                autoFocus
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("authenticating") : t("unlock")}
          </Button>
        </form>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>{t("data.security")}</p>
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

export default LoginPage; 