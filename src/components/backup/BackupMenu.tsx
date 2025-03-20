
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePasswords } from "@/context/PasswordContext";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Save, Download, HardDrive, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import FileReader from "@/plugins/FileReaderPlugin";
import CryptoJS from 'crypto-js';

const BackupMenu: React.FC = () => {
  const { t } = useLanguage();
  const { passwords, restorePasswords } = usePasswords();
  const { masterPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLocalBackup = () => {
    if (!masterPassword) {
      toast.error(t("backup.master_password_required"));
      navigate("/backup"); // Redirect to the full backup page for better handling
      return;
    }

    setIsLoading(true);
    try {
      // Create a JSON string and encrypt it using proper encryption
      const data = JSON.stringify(passwords);
      const encryptedData = CryptoJS.AES.encrypt(data, masterPassword).toString();
      
      if (Capacitor.isNativePlatform()) {
        // Fix: Use direct import for FileSaver plugin in native environment
        const FileSaverPlugin = (Capacitor as any).Plugins.FileSaver;
        if (FileSaverPlugin) {
          try {
            FileSaverPlugin.saveFile({
              fileName: `password-backup-${new Date().toISOString().slice(0, 10)}.pwe`,
              fileContent: encryptedData,
              mimeType: "application/octet-stream"
            }).then((result: any) => {
              if (result.success) {
                toast.success(t("backup.local.success"));
              }
              setIsLoading(false);
            }).catch((err: any) => {
              console.error("Native backup failed:", err);
              toast.error(t("backup.local.error"));
              setIsLoading(false);
            });
          } catch (err) {
            console.error("Native backup failed:", err);
            toast.error(t("backup.local.error"));
            setIsLoading(false);
          }
        } else {
          toast.error("FileSaver plugin not available");
          setIsLoading(false);
        }
      } else {
        // Web browser implementation
        const blob = new Blob([encryptedData], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = `password-backup-${new Date().toISOString().slice(0, 10)}.pwe`;
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

  const handleGoogleDriveBackup = () => {
    if (!masterPassword) {
      toast.error(t("backup.master_password_required"));
      navigate("/backup"); // Redirect to the full backup page for better handling
      return;
    }

    setIsLoading(true);
    // Mock Google Drive backup
    setTimeout(() => {
      toast.error(t("backup.google.auth"));
      setIsLoading(false);
    }, 1000);
  };

  const handleLocalRestore = async () => {
    if (!masterPassword) {
      toast.error(t("backup.master_password_required"));
      navigate("/backup"); // Redirect to the full backup page for better handling
      return;
    }
    
    setIsLoading(true);
    
    if (Capacitor.isNativePlatform()) {
      try {
        // Fix: Use direct access to FileSaver plugin
        const FileSaverPlugin = (Capacitor as any).Plugins.FileSaver;
        
        if (!FileSaverPlugin) {
          throw new Error("FileSaver plugin not available");
        }
        
        const result = await FileSaverPlugin.openFile({
          mimeType: "application/octet-stream",
          extensions: ["pwe"]
        });
        
        if (result && result.path) {
          try {
            // Fix: Use FileReader plugin instance directly without constructing
            const fileContent = await FileReader.readFile({ path: result.path });
            
            if (fileContent && fileContent.data) {
              try {
                // Decrypt with the master password (which is available because we check at the beginning)
                const decryptedData = CryptoJS.AES.decrypt(fileContent.data, masterPassword).toString(CryptoJS.enc.Utf8);
                
                if (!decryptedData) {
                  throw new Error("Decryption failed");
                }
                
                // Validate that it's valid JSON
                const parsedData = JSON.parse(decryptedData);
                
                // Restore passwords
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
      } catch (error) {
        console.error("Native restore failed:", error);
        if (error.message !== "File opening cancelled by user") {
          toast.error(t("restore.local.error"));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Implémentation pour navigateur web
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pwe";
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          
          reader.onload = (event) => {
            try {
              const encryptedData = event.target?.result as string;
              
              try {
                // Tenter de déchiffrer avec le mot de passe maître (qui est disponible car nous vérifions au début)
                const decryptedData = CryptoJS.AES.decrypt(encryptedData, masterPassword).toString(CryptoJS.enc.Utf8);
                
                if (!decryptedData) {
                  throw new Error("Decryption failed");
                }
                
                // Valider que c'est un JSON valide
                const parsedData = JSON.parse(decryptedData);
                
                // Restore passwords
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
        } else {
          setIsLoading(false);
        }
      };
      
      input.click();
    }
  };

  const handleGoogleDriveRestore = () => {
    if (!masterPassword) {
      toast.error(t("backup.master_password_required"));
      navigate("/backup"); // Redirect to the full backup page for better handling
      return;
    }
    
    setIsLoading(true);
    // Mock Google Drive restore
    setTimeout(() => {
      toast.error(t("restore.google.auth"));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 w-full justify-start">
          <Save className="h-4 w-4" />
          <span>{t("backup")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem 
          onClick={handleLocalBackup}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <HardDrive className="mr-2 h-4 w-4" />
          <span>{t("backup.local")}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleGoogleDriveBackup}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <CloudUpload className="mr-2 h-4 w-4" />
          <span>{t("backup.google")}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLocalRestore}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>{t("restore.local")}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleGoogleDriveRestore}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>{t("restore.google")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BackupMenu;
