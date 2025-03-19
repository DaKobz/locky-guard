import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageContext";
import CryptoJS from "crypto-js";
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  masterPassword: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  setMasterPassword: (password: string) => Promise<boolean>;
  resetStoredData: () => void;
  ensureMasterPasswordConsistency: () => string | null;
}

// Clé pour stocker l'horodatage de la dernière authentification
const LAST_AUTH_TIMESTAMP_KEY = "last_auth_timestamp";
// Durée maximale d'inactivité en millisecondes avant déconnexion automatique (5 minutes)
const MAX_INACTIVITY_DURATION = 5 * 60 * 1000;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);
  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Fonction pour s'assurer que le mot de passe maître utilisé est le bon
  const ensureMasterPasswordConsistency = () => {
    // Vérifier que le mot de passe en mémoire correspond exactement à celui dans localStorage
    const storedPassword = localStorage.getItem("masterPassword");
    
    if (storedPassword && masterPassword !== storedPassword) {
      console.log("Synchronisation du mot de passe maître avec localStorage pour la cohérence du chiffrement");
      setMasterPasswordState(storedPassword);
      return storedPassword;
    }
    
    return masterPassword;
  };

  // Fonction pour réinitialiser les données stockées
  const resetStoredData = () => {
    // Approche radicale : supprimer toutes les données du localStorage
    const preserveKeys = ['sentry', 'debugging', 'language', 'theme']; // clés à conserver
    
    Object.keys(localStorage).forEach(key => {
      if (!preserveKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Réinitialiser l'état de l'application
    setIsFirstLogin(true);
    setIsAuthenticated(false);
    setMasterPasswordState(null);
    
    console.log("Toutes les données ont été réinitialisées avec succès");
    
    // Afficher une notification pour informer l'utilisateur
    toast.success(t("reset.data.success"));
    
    // Forcer un rechargement complet après un court délai pour s'assurer que toutes les modifications sont appliquées
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };
  
  // Écouter les événements du cycle de vie de l'application
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupAppListeners = async () => {
        App.addListener('appStateChange', ({ isActive }) => {
          if (!isActive) {
            // L'application passe en arrière-plan, stocker l'horodatage
            localStorage.setItem(LAST_AUTH_TIMESTAMP_KEY, Date.now().toString());
            console.log("Application en arrière-plan, horodatage enregistré");
          } else {
            // L'application revient au premier plan, vérifier le délai d'inactivité
            const lastAuthTimestamp = localStorage.getItem(LAST_AUTH_TIMESTAMP_KEY);
            if (lastAuthTimestamp) {
              const inactivityDuration = Date.now() - parseInt(lastAuthTimestamp);
              console.log(`Durée d'inactivité: ${inactivityDuration}ms, max: ${MAX_INACTIVITY_DURATION}ms`);
              
              // Si inactif trop longtemps, déconnecter l'utilisateur
              if (inactivityDuration > MAX_INACTIVITY_DURATION) {
                console.log("Déconnexion automatique après inactivité");
                logout();
              }
            }
          }
        });
        
        // L'application va se fermer définitivement
        App.addListener('backButton', (data) => {
          // Déconnecter l'utilisateur si l'application se ferme
          if (data.canGoBack === false) {
            logout();
            console.log("Déconnexion lors de la fermeture de l'application");
          }
        });
      };
      
      setupAppListeners();
      return () => {
        // Nettoyer les écouteurs quand le composant est démonté
        App.removeAllListeners();
      };
    }
  }, []);

  // Vérifier l'état de l'authentification au démarrage
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Forcer la déconnexion au démarrage de l'application (garantie supplémentaire)
        localStorage.removeItem("isAuthenticated");
        localStorage.setItem("forceLogout", "true");
        
        // Vérifier si un mot de passe maître a déjà été défini
        const hasSetPassword = localStorage.getItem("hasSetMasterPassword");
        const storedMasterPassword = localStorage.getItem("masterPassword");
        
        // Si aucun mot de passe n'a été défini, considérer qu'il s'agit de la première connexion
        if (!hasSetPassword || !storedMasterPassword) {
          setIsFirstLogin(true);
          setIsAuthenticated(false);
          setMasterPasswordState(null);
          setIsLoading(false);
          console.log("Première connexion détectée");
          return;
        }
        
        // Si un mot de passe maître est trouvé, mais l'utilisateur n'est pas authentifié
        setMasterPasswordState(storedMasterPassword);
        setIsFirstLogin(false);
        
        // Toujours démarrer comme non authentifié, forçant ainsi la page de connexion
        setIsAuthenticated(false);
        setIsLoading(false);
        console.log("Connexion requise au démarrage (politique de sécurité)");
      } catch (error) {
        setIsFirstLogin(true);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Configurer un intervalle qui vérifie régulièrement l'état d'authentification forcé
    const authCheckInterval = setInterval(() => {
      if (localStorage.getItem("forceLogout") === "true") {
        setIsAuthenticated(false);
        localStorage.removeItem("forceLogout");
        console.log("Déconnexion forcée par le mécanisme de sécurité");
      }
    }, 1000);
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  const setMasterPassword = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Délai simulé d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Dans une vraie app, nous hasherions le mot de passe avant de le stocker
      localStorage.setItem("hasSetMasterPassword", "true");
      
      // Stocker le mot de passe maître dans localStorage avec un sel pour plus de sécurité
      const salt = CryptoJS.lib.WordArray.random(128/8).toString();
      localStorage.setItem("passwordSalt", salt);
      
      // Hasher le mot de passe pour la vérification
      const hashedPassword = CryptoJS.SHA256(password + salt).toString();
      localStorage.setItem("passwordHash", hashedPassword);
      
      // Stocker le mot de passe en clair (en prod on utiliserait un système plus sécurisé)
      localStorage.setItem("masterPassword", password);
      
      setMasterPasswordState(password);
      setIsFirstLogin(false);
      setIsAuthenticated(true);
      
      // Enregistrer l'horodatage d'authentification
      localStorage.setItem(LAST_AUTH_TIMESTAMP_KEY, Date.now().toString());
      localStorage.removeItem("forceLogout");
      
      toast.success(t("password.creation.success"));
      return true;
    } catch (error) {
      toast.error(t("password.creation.error"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Si nous sommes en mode première connexion, refuser la connexion
      if (isFirstLogin) {
        toast.error(t("create.master.password.first"));
        return false;
      }
      
      // Vérifier par rapport au mot de passe maître stocké
      const storedPassword = localStorage.getItem("masterPassword");
      const storedSalt = localStorage.getItem("passwordSalt");
      const storedHash = localStorage.getItem("passwordHash");
      
      if (!storedPassword || !storedSalt || !storedHash) {
        toast.error(t("authentication.error.missing.config"));
        return false;
      }
      
      // Vérification du mot de passe via le hash
      const inputHash = CryptoJS.SHA256(password + storedSalt).toString();
      
      if (inputHash === storedHash) {
        setIsAuthenticated(true);
        setMasterPasswordState(storedPassword);
        
        // Enregistrer l'horodatage d'authentification
        localStorage.setItem(LAST_AUTH_TIMESTAMP_KEY, Date.now().toString());
        localStorage.removeItem("forceLogout");
        
        toast.success(t("authentication.success"));
        return true;
      } else {
        toast.error(t("incorrect.password"));
        return false;
      }
    } catch (error) {
      toast.error(t("authentication.error"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setMasterPasswordState(null); // Effacer le mot de passe de la mémoire lors de la déconnexion
    
    // Supprimer tous les marqueurs d'authentification
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem(LAST_AUTH_TIMESTAMP_KEY);
    localStorage.setItem("forceLogout", "true");
    
    toast.info(t("logout.success"));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isFirstLogin,
        masterPassword,
        login,
        logout,
        setMasterPassword,
        resetStoredData,
        ensureMasterPasswordConsistency,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
