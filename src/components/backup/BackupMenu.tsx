
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePasswords } from "@/context/PasswordContext";
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

const BackupMenu: React.FC = () => {
  const { t } = useLanguage();
  const { passwords } = usePasswords();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocalBackup = () => {
    setIsLoading(true);
    try {
      // Create a JSON string and encrypt it (mock encryption)
      const data = JSON.stringify(passwords);
      const encryptedData = btoa(data); // Simple Base64 encoding (not actual encryption)
      
      // Create a Blob with the data
      const blob = new Blob([encryptedData], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `password-backup-${new Date().toISOString().slice(0, 10)}.pwe`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t("backup.local.success"));
    } catch (error) {
      console.error("Local backup failed:", error);
      toast.error(t("backup.local.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleDriveBackup = () => {
    setIsLoading(true);
    // Mock Google Drive backup
    setTimeout(() => {
      toast.error(t("backup.google.auth"));
      setIsLoading(false);
    }, 1000);
  };

  const handleLocalRestore = () => {
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
            // Decrypt the data (mock decryption)
            const data = atob(encryptedData);
            // Parse the JSON data
            JSON.parse(data); // Just to validate
            
            toast.success(t("restore.local.success"));
            // Here we would actually restore the passwords
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
  };

  const handleGoogleDriveRestore = () => {
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
