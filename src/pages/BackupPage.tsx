import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePasswords } from "@/context/PasswordContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Download, Shield, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileSaver } from "@/hooks/use-file-saver";

const BackupPage = () => {
  const { t } = useLanguage();
  const { passwords, updatePasswords } = usePasswords();
  const { masterPassword, login, ensureMasterPasswordConsistency } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(!masterPassword);
  const navigate = useNavigate();
  const { saveFile, isNativePlatform } = useFileSaver();

  const confirmMasterPassword = async () => {
    if (!enteredPassword.trim()) {
      toast.error(t("backup.password_required"));
      return;
    }

    const success = await login(enteredPassword);
    if (success) {
      setIsConfirmPasswordVisible(false);
    }
  };

  const handleLocalBackup = async () => {
    if (!masterPassword && !isConfirmPasswordVisible) {
      setIsConfirmPasswordVisible(true);
      toast.error(t("backup.master_password_required"));
      return;
    }

    // S'assurer d'utiliser exactement le même mot de passe maître que celui stocké
    const passwordToUse = ensureMasterPasswordConsistency();
    
    if (!passwordToUse) {
      toast.error(t("backup.master_password_required"));
      return;
    }

    setIsLoading(true);
    try {
      // Créer une chaîne JSON des mots de passe
      const data = JSON.stringify(passwords);
      console.log("Préparation de la sauvegarde - Format des données:", Array.isArray(passwords) ? "Array" : typeof passwords, "Longueur:", passwords.length);
      
      // Chiffrer les données avec le mot de passe maître comme clé
      // Utilisation standardisée de CryptoJS pour assurer la compatibilité entre sauvegarde et restauration
      const encryptedData = CryptoJS.AES.encrypt(data, passwordToUse).toString();
      console.log("Données chiffrées avec succès");
      
      // Nom de fichier suggéré
      const fileName = `locky-backup-${new Date().toISOString().slice(0, 10)}.pwe`;
      
      // Utiliser notre hook de sauvegarde de fichier
      const success = await saveFile(fileName, encryptedData, {
        mimeType: 'application/octet-stream'
      });
      
      if (success) {
        toast.success(t("backup.local.success"));
      } else {
        toast.error(t("backup.local.error"));
      }
    } catch (error) {
      console.error("Local backup failed:", error);
      toast.error(t("backup.local.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalRestore = () => {
    if (!masterPassword && !isConfirmPasswordVisible) {
      setIsConfirmPasswordVisible(true);
      toast.error(t("backup.master_password_required"));
      return;
    }

    // S'assurer d'utiliser exactement le même mot de passe maître que celui stocké
    const passwordToUse = ensureMasterPasswordConsistency();
    
    if (!passwordToUse) {
      toast.error(t("backup.master_password_required"));
      return;
    }

    // Utiliser l'API File System Access si disponible
    if (window.showOpenFilePicker) {
      const openFile = async () => {
        setIsLoading(true);
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            types: [{
              description: 'Locky Password Encrypted File',
              accept: { 'application/octet-stream': ['.pwe'] }
            }],
            multiple: false
          });
          
          const file = await fileHandle.getFile();
          const encryptedData = await file.text();
          
          try {
            // Tenter de déchiffrer avec le mot de passe maître
            console.log("Tentative de déchiffrement avec le mot de passe maître...");
            
            // Vérifier que les données encryptées sont valides
            if (!encryptedData || encryptedData.trim() === '') {
              console.error("Données chiffrées vides ou invalides");
              throw new Error("Invalid encrypted data");
            }
            
            // Vérifier que le mot de passe est disponible
            if (!passwordToUse || passwordToUse.trim() === '') {
              console.error("Mot de passe maître vide ou invalide");
              throw new Error("Invalid master password");
            }
            
            // Tentative de déchiffrement
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, passwordToUse);
            const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            console.log("Statut du déchiffrement:", decryptedData ? "Réussi" : "Échec");
            
            if (!decryptedData || decryptedData.trim() === '') {
              console.error("Échec du déchiffrement - Résultat vide");
              toast.error(t("restore.wrong_master_password"));
              throw new Error("Decryption failed - empty result");
            }
            
            // Tenter de parser les données JSON
            try {
              const parsedData = JSON.parse(decryptedData);
              console.log("Analyse JSON réussie, format des données:", Array.isArray(parsedData) ? "Array" : typeof parsedData);
              
              // Restaurer les mots de passe à partir des données déchiffrées
              if (Array.isArray(parsedData)) {
                // Remplacer tous les mots de passe existants par ceux du fichier de sauvegarde
                updatePasswords(parsedData);
                toast.success(t("restore.local.success"));
              } else {
                console.error("Format de sauvegarde invalide:", typeof parsedData);
                toast.error(t("restore.invalid_format"));
                throw new Error("Invalid backup format - not an array");
              }
            } catch (jsonError) {
              console.error("Erreur lors de l'analyse JSON:", jsonError);
              toast.error(t("restore.invalid_json"));
              throw new Error("JSON parsing failed after decryption");
            }
          } catch (decryptError) {
            console.error("Erreur de déchiffrement détaillée:", decryptError);
            toast.error(t("restore.wrong_master_password"));
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Open file error:", error);
            toast.error(t("restore.local.error"));
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      openFile();
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API File System Access
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pwe";
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setIsLoading(true);
          const reader = new FileReader();
          
          reader.onload = (event) => {
            try {
              const encryptedData = event.target?.result as string;
              
              try {
                // Tenter de déchiffrer avec le mot de passe maître
                console.log("Tentative de déchiffrement avec le mot de passe maître...");
                
                // Vérifier que les données encryptées sont valides
                if (!encryptedData || encryptedData.trim() === '') {
                  console.error("Données chiffrées vides ou invalides");
                  throw new Error("Invalid encrypted data");
                }
                
                // Vérifier que le mot de passe est disponible
                if (!passwordToUse || passwordToUse.trim() === '') {
                  console.error("Mot de passe maître vide ou invalide");
                  throw new Error("Invalid master password");
                }
                
                // Tentative de déchiffrement
                const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, passwordToUse);
                const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
                
                console.log("Statut du déchiffrement:", decryptedData ? "Réussi" : "Échec");
                
                if (!decryptedData || decryptedData.trim() === '') {
                  console.error("Échec du déchiffrement - Résultat vide");
                  toast.error(t("restore.wrong_master_password"));
                  throw new Error("Decryption failed - empty result");
                }
                
                // Tenter de parser les données JSON
                try {
                  const parsedData = JSON.parse(decryptedData);
                  console.log("Analyse JSON réussie, format des données:", Array.isArray(parsedData) ? "Array" : typeof parsedData);
                  
                  // Restaurer les mots de passe à partir des données déchiffrées
                  if (Array.isArray(parsedData)) {
                    // Remplacer tous les mots de passe existants par ceux du fichier de sauvegarde
                    updatePasswords(parsedData);
                    toast.success(t("restore.local.success"));
                  } else {
                    console.error("Format de sauvegarde invalide:", typeof parsedData);
                    toast.error(t("restore.invalid_format"));
                    throw new Error("Invalid backup format - not an array");
                  }
                } catch (jsonError) {
                  console.error("Erreur lors de l'analyse JSON:", jsonError);
                  toast.error(t("restore.invalid_json"));
                  throw new Error("JSON parsing failed after decryption");
                }
              } catch (decryptError) {
                console.error("Erreur de déchiffrement détaillée:", decryptError);
                toast.error(t("restore.wrong_master_password"));
              }
            } catch (error) {
              console.error("Local restore failed:", error);
              toast.error(t("restore.local.error"));
            } finally {
              setIsLoading(false);
            }
          };
          
          reader.onerror = () => {
            toast.error(t("restore.local.error"));
            setIsLoading(false);
          };
          
          reader.readAsText(file);
        }
      };
      
      input.click();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t("back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("backup")}</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {isConfirmPasswordVisible ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("backup.confirm_password")}</CardTitle>
            <CardDescription>{t("backup.confirm_password_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="masterPassword">{t("main.password")}</Label>
                <Input 
                  id="masterPassword" 
                  type="password" 
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder={t("main.password")}
                />
              </div>
              <Button 
                onClick={confirmMasterPassword}
                disabled={isLoading || !enteredPassword}
              >
                {isLoading ? t("confirming") : t("confirm")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Local Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                {t("backup.local.title")}
              </CardTitle>
              <CardDescription>{t("backup.local.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleLocalBackup}
                disabled={isLoading}
                className="flex-1"
              >
                <HardDrive className="mr-2 h-4 w-4" />
                {t("backup.local")}
              </Button>
              
              <Button 
                onClick={handleLocalRestore}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("restore.local")}
              </Button>
            </CardContent>
          </Card>
          
          {/* Security Note */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">{t("security.note")}</h3>
                  <p className="text-sm text-muted-foreground">{t("security.backup.description")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Encryption Note */}
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lock className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">{t("encryption.note")}</h3>
                  <p className="text-sm text-muted-foreground">{t("encryption.backup.description")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const usePasswordContext = () => {
  // Fix for the typo in the import; usePasswords is the correct hook
  return usePasswords();
};

export default BackupPage;
