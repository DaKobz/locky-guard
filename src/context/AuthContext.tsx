
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
  const [masterPasswordState, setMasterPasswordState] = useState<string | null>(null);

  // In a real app, we would check for a stored token or session
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if master password has been set
        const hasSetPassword = localStorage.getItem("hasSetMasterPassword");
        
        if (!hasSetPassword) {
          setIsFirstLogin(true);
        }
        
        // Try to retrieve the master password from localStorage (in a real app, this would be more secure)
        const storedMasterPassword = localStorage.getItem("masterPassword");
        if (storedMasterPassword) {
          setMasterPasswordState(storedMasterPassword);
        }
        
        // Simulate checking stored credentials
        setTimeout(() => {
          // If master password is found, consider the user authenticated
          setIsAuthenticated(storedMasterPassword ? true : false);
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
      // Store the master password in localStorage (in a real app, this would be done securely)
      localStorage.setItem("masterPassword", password);
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
      
      // Compare with the stored master password
      const correctPassword = masterPasswordState;
      
      if (password === correctPassword) {
        setIsAuthenticated(true);
        // Save the password in state and localStorage (in a real app, this would be done securely)
        setMasterPasswordState(password);
        localStorage.setItem("masterPassword", password);
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
    // Also clear the master password state to ensure the login page is shown
    setMasterPasswordState(null);
    // Don't clear the master password from localStorage on logout to maintain backup functionality
    toast.info("Vous êtes déconnecté");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isFirstLogin,
        masterPassword: masterPasswordState,
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
