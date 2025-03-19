import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PasswordProvider } from "@/context/PasswordContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/LoginPage";
import PasswordList from "@/pages/PasswordList";
import Favorites from "@/pages/Favorites";
import PasswordGenerator from "@/pages/PasswordGenerator";
import AddPassword from "@/pages/AddPassword";
import NotFound from "@/pages/NotFound";
import BackupPage from "@/pages/BackupPage";
import ProUpgrade from "@/pages/ProUpgrade";
import PaymentSuccess from "@/pages/PaymentSuccess";
import LegalPage from "@/pages/LegalPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import LegalNoticePage from "@/pages/legal/LegalNoticePage";
import DataSecurityPage from "@/pages/legal/DataSecurityPage";
import SetupPasswordPage from "@/pages/SetupPasswordPage";
import { resetAppData } from "@/lib/initialSetup";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

// Réinitialise les données au premier démarrage
resetAppData();

// Force la déconnexion à chaque démarrage de l'application
// pour garantir que l'utilisateur doit saisir son mot de passe
if (typeof window !== "undefined") {
  localStorage.setItem("forceLogout", "true");
  localStorage.removeItem("isAuthenticated");
  console.log("Politique de sécurité: déconnexion forcée au démarrage de l'application");
}

// Initialisation du client de requêtes
const queryClient = new QueryClient();

// Composant de redirection en fonction de l'état d'authentification
const AuthRedirect = () => {
  const { isAuthenticated, isFirstLogin, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Forcer la déconnexion au démarrage de l'application
    if (Capacitor.isNativePlatform()) {
      console.log("Application capacitor détectée, vérification de la sécurité");
      localStorage.setItem("forceLogout", "true");
      localStorage.removeItem("isAuthenticated");
    }
    
    // Attendre que le chargement soit terminé
    if (!isLoading) {
      setIsRedirecting(false);
    }
  }, [isLoading]);
  
  // Pendant le chargement ou la redirection, afficher un simple écran de chargement
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Si c'est la première connexion, rediriger vers la page de configuration
  if (isFirstLogin) {
    console.log("Redirection vers la page de configuration (première connexion)");
    return <Navigate to="/setup" replace />;
  }
  
  // Si ce n'est pas la première connexion et que l'utilisateur n'est pas authentifié, 
  // rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log("Redirection vers la page de connexion (non authentifié)");
    return <Navigate to="/login" replace />;
  }
  
  // Si authentifié, rediriger vers le tableau de bord
  console.log("Redirection vers le tableau de bord (authentifié)");
  return <Navigate to="/dashboard" replace />;
};

// Composant pour protéger les routes qui nécessitent une authentification
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    // Forcer la déconnexion pour s'assurer que l'utilisateur soit redirigé vers la page de connexion
    localStorage.setItem("forceLogout", "true");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Pour détecter la réinitialisation au premier chargement (utile pour le débogage)
  useEffect(() => {
    const isFirstRun = !localStorage.getItem("APP_VISITED");
    if (isFirstRun) {
      console.log("Première visite - l'utilisateur devrait voir l'écran de création de mot de passe");
      localStorage.setItem("APP_VISITED", new Date().toISOString());
    }
    
    // Configurer les écouteurs d'événements natifs pour les plateformes mobiles
    if (Capacitor.isNativePlatform()) {
      // Lorsque l'application est reprise depuis l'arrière-plan
      CapApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log("Application reprise depuis l'arrière-plan");
          // Forcer la vérification de l'authentification
          if (localStorage.getItem("forceLogout") !== "true") {
            localStorage.setItem("forceLogout", "true");
          }
        }
      });
      
      // Nettoyage
      return () => {
        CapApp.removeAllListeners();
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PurchaseProvider>
                <PasswordProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/setup" element={<SetupPasswordPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/legal" element={<LegalPage />} />
                      <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/legal/terms" element={<TermsOfServicePage />} />
                      <Route path="/legal/notice" element={<LegalNoticePage />} />
                      <Route path="/legal/security" element={<DataSecurityPage />} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/" element={<AuthRedirect />} />
                      <Route element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/passwords" element={<PasswordList />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/generator" element={<PasswordGenerator />} />
                        <Route path="/add" element={<AddPassword />} />
                        <Route path="/backup" element={<BackupPage />} />
                        <Route path="/pro" element={<ProUpgrade />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </PasswordProvider>
              </PurchaseProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
