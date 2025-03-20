
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
import { Capacitor } from '@capacitor/core';
import FileReader from "@/plugins/FileReaderPlugin";

const BackupPage = () => {
  const { t } = useLanguage();
  const { passwords, restorePasswords } = usePasswordContext();
  const { masterPassword, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(!masterPassword);
  const navigate = useNavigate();

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

  const handleLocalBackup = () => {
    if (!masterPassword && !isConfirmPasswordVisible) {
      setIsConfirmPasswordVisible(true);
      toast.error(t("backup.master_password_required"));
      return;
    }

    const passwordToUse = masterPassword;
    
    if (!passwordToUse) {
      toast.error(t("backup.master_password_required"));
      return;
    }

    setIsLoading(true);
    try {
      const data = JSON.stringify(passwords);
      
      const encryptedData = CryptoJS.AES.encrypt(data, passwordToUse).toString();
      
      const blob = new Blob([encryptedData], { type: "application/octet-stream" });
      
      if (window.showSaveFilePicker) {
        const saveFile = async () => {
          try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: `locky-backup-${new Date().toISOString().slice(0, 10)}.pwe`,
              types: [{
                description: 'Locky Password Encrypted File',
                accept: { 'application/octet-stream': ['.pwe'] }
              }]
            });
            
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            
            toast.success(t("backup.local.success"));
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error("Save file error:", error);
              toast.error(t("backup.local.error"));
            }
          } finally {
            setIsLoading(false);
          }
        };
        
        saveFile();
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `locky-backup-${new Date().toISOString().slice(0, 10)}.pwe`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(t("backup.local.success"));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Local backup failed:", error);
      toast.error(t("backup.local.error"));
      setIsLoading(false);
    }
  };

  const handleLocalRestore = async () => {
    if (!masterPassword && !isConfirmPasswordVisible) {
      setIsConfirmPasswordVisible(true);
      toast.error(t("backup.master_password_required"));
      return;
    }

    const passwordToUse = masterPassword;
    
    if (!passwordToUse) {
      toast.error(t("backup.master_password_required"));
      return;
    }

    if (Capacitor.isNativePlatform()) {
      try {
        // Fix: Use Capacitor Plugins directly
        const Plugins = (Capacitor as any).Plugins;
        if (Plugins.FileSaver) {
          try {
            const result = await Plugins.FileSaver.openFile({
              mimeType: "application/octet-stream",
              extensions: ["pwe"]
            });
            
            if (result && result.path) {
              try {
                // Fix: Use FileReader directly without trying to construct it
                const fileContent = await FileReader.readFile({ path: result.path });
                
                if (fileContent && fileContent.data) {
                  try {
                    const decryptedData = CryptoJS.AES.decrypt(fileContent.data, passwordToUse).toString(CryptoJS.enc.Utf8);
                    
                    if (!decryptedData) {
                      throw new Error("Decryption failed");
                    }
                    
                    const parsedData = JSON.parse(decryptedData);
                    
                    restorePasswords(parsedData);
                    toast.success(t("restore.local.success"));
                  } catch (decryptError) {
                    console.error("Decryption error:", decryptError);
                    toast.error(t("restore.wrong_master_password"));
                  }
                } else {
                  toast.error(t("restore.local.error"));
                }
              } catch (readError) {
                console.error("File reading error:", readError);
                toast.error(t("restore.local.error"));
              }
            }
          } catch (openError) {
            if (openError.message !== "File opening cancelled by user") {
              console.error("File opening error:", openError);
              toast.error(t("restore.local.error"));
            }
          }
        } else {
          toast.error("FileSaver plugin not available");
        }
      } catch (error) {
        console.error("Native restore failed:", error);
        toast.error(t("restore.local.error"));
      } finally {
        setIsLoading(false);
      }
    } else {
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
              const decryptedData = CryptoJS.AES.decrypt(encryptedData, passwordToUse).toString(CryptoJS.enc.Utf8);
              
              if (!decryptedData) {
                throw new Error("Decryption failed");
              }
              
              const parsedData = JSON.parse(decryptedData);
              
              restorePasswords(parsedData);
              
              toast.success(t("restore.local.success"));
            } catch (decryptError) {
              console.error("Decryption error:", decryptError);
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
                  const decryptedData = CryptoJS.AES.decrypt(encryptedData, passwordToUse).toString(CryptoJS.enc.Utf8);
                  
                  if (!decryptedData) {
                    throw new Error("Decryption failed");
                  }
                  
                  const parsedData = JSON.parse(decryptedData);
                  
                  restorePasswords(parsedData);
                  
                  toast.success(t("restore.local.success"));
                } catch (decryptError) {
                  console.error("Decryption error:", decryptError);
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
        <div className="w-10"></div>
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
  return usePasswords();
};

export default BackupPage;
