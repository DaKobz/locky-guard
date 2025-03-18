import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  masterPassword: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  setMasterPassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);

  // In a real app, we would check for a stored token or session
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if master password has been set
        const hasSetPassword = localStorage.getItem("hasSetMasterPassword");
        
        if (!hasSetPassword) {
          setIsFirstLogin(true);
        }
        
        // Simulate checking stored credentials
        setTimeout(() => {
          setIsAuthenticated(false);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setMasterPassword = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would hash the password before storing
      localStorage.setItem("hasSetMasterPassword", "true");
      setMasterPasswordState(password);
      setIsFirstLogin(false);
      setIsAuthenticated(true); // Auto-login user after setting password
      toast.success("Mot de passe maître créé avec succès");
      return true;
    } catch (error) {
      toast.error("Erreur lors de la création du mot de passe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    // In a real app, we would validate against a hashed password
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For demo, use the set master password if available, otherwise fall back to the demo password
      const correctPassword = masterPassword || "locky123";
      
      if (password === correctPassword) {
        setIsAuthenticated(true);
        toast.success("Authentification réussie");
        return true;
      } else {
        toast.error("Mot de passe incorrect");
        return false;
      }
    } catch (error) {
      toast.error("Erreur lors de l'authentification");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.info("Vous êtes déconnecté");
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
