import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PasswordEntry, PasswordCategory } from "@/types/password";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

// Événements personnalisés pour la communication entre contextes
const PASSWORD_LIMIT_EVENT = 'passwordLimitUpdate';
const PASSWORD_COUNT_EVENT = 'passwordCountUpdate';

// Constante de limite pour l'utilisateur non Pro
const FREE_USER_PASSWORD_LIMIT = 3;

interface PasswordContextProps {
  passwords: PasswordEntry[];
  addPassword: (password: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt">) => boolean;
  updatePassword: (id: string, password: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  toggleFavorite: (id: string) => void;
  generatePassword: (
    length: number,
    includeUppercase: boolean,
    includeNumbers: boolean,
    includeSpecialChars: boolean
  ) => string;
  getRemainingPasswordCount: () => number;
  isLimitReached: () => boolean;
}

const PasswordContext = createContext<PasswordContextProps | undefined>(undefined);

// Tableau vide pour initialiser sans exemples
const initialPasswords: PasswordEntry[] = [];

// Variables pour stocker les limites
let currentLimit = FREE_USER_PASSWORD_LIMIT;
let canAddMorePassword = false;

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords);
  const [isUserPro, setIsUserPro] = useState<boolean>(false);

  // Vérifier strictement si la limite est atteinte
  const isStrictlyLimitReached = (): boolean => {
    if (isUserPro) return false;
    return passwords.length >= FREE_USER_PASSWORD_LIMIT;
  };

  // Écouter les mises à jour des limites
  useEffect(() => {
    const handleLimitUpdate = (event: CustomEvent) => {
      currentLimit = event.detail.limit;
      canAddMorePassword = event.detail.canAdd;
      setIsUserPro(event.detail.canAdd && event.detail.limit === Infinity);
    };

    window.addEventListener(PASSWORD_LIMIT_EVENT, handleLimitUpdate as EventListener);
    
    // Émettre un événement initial pour notifier le nombre de mots de passe
    const initialEvent = new CustomEvent(PASSWORD_COUNT_EVENT, {
      detail: { count: passwords.length }
    });
    window.dispatchEvent(initialEvent);
    
    return () => {
      window.removeEventListener(PASSWORD_LIMIT_EVENT, handleLimitUpdate as EventListener);
    };
  }, []);

  // Émettre les mises à jour du nombre de mots de passe
  useEffect(() => {
    const event = new CustomEvent(PASSWORD_COUNT_EVENT, {
      detail: { count: passwords.length }
    });
    window.dispatchEvent(event);
  }, [passwords.length]);

  const addPassword = (
    passwordData: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt">
  ): boolean => {
    // Vérifier explicitement si la limite est atteinte
    if (isStrictlyLimitReached() && !isUserPro) {
      toast.error(t("password.limit.reached") || "Limite de mots de passe atteinte. Passez à la version Pro pour en ajouter davantage.");
      return false;
    }

    const newPassword: PasswordEntry = {
      ...passwordData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPasswords((prev) => [...prev, newPassword]);
    toast.success(t("password.added") || "Mot de passe ajouté avec succès");
    return true;
  };

  const updatePassword = (id: string, passwordData: Partial<PasswordEntry>) => {
    setPasswords((prev) =>
      prev.map((password) =>
        password.id === id
          ? { ...password, ...passwordData, updatedAt: new Date() }
          : password
      )
    );
    toast.success(t("password.updated") || "Mot de passe mis à jour");
  };

  const deletePassword = (id: string) => {
    setPasswords((prev) => prev.filter((password) => password.id !== id));
    toast.success(t("password.deleted") || "Mot de passe supprimé");
  };

  const toggleFavorite = (id: string) => {
    setPasswords((prev) =>
      prev.map((password) =>
        password.id === id
          ? { ...password, favorite: !password.favorite, updatedAt: new Date() }
          : password
      )
    );
  };

  const generatePassword = (
    length: number,
    includeUppercase: boolean,
    includeNumbers: boolean,
    includeSpecialChars: boolean
  ) => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSpecialChars) characters += specialChars;

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  };

  const getRemainingPasswordCount = () => {
    if (currentLimit === Infinity || isUserPro) {
      return Infinity;
    }
    return Math.max(0, currentLimit - passwords.length);
  };

  const isLimitReached = () => {
    if (currentLimit === Infinity || isUserPro) {
      return false;
    }
    return passwords.length >= currentLimit;
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        addPassword,
        updatePassword,
        deletePassword,
        toggleFavorite,
        generatePassword,
        getRemainingPasswordCount,
        isLimitReached,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error("usePasswords must be used within a PasswordProvider");
  }
  return context;
};
