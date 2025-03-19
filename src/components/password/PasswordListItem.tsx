
import React, { useState } from "react";
import { PasswordEntry } from "@/types/password";
import { Star, Edit, Trash2, Copy, Eye, EyeOff, ExternalLink, Globe, Smartphone, CreditCard, Mail, MessageSquare, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePasswords } from "@/context/PasswordContext";
import { cn } from "@/lib/utils";

interface PasswordListItemProps {
  password: PasswordEntry;
  showActions?: boolean;
}

const PasswordListItem: React.FC<PasswordListItemProps> = ({ 
  password, 
  showActions = true
}) => {
  const { toggleFavorite, deletePassword } = usePasswords();
  const [showPassword, setShowPassword] = useState(false);
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papiers`);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "website":
        return <Globe className="h-4 w-4" />;
      case "application":
        return <Smartphone className="h-4 w-4" />;
      case "banking":
        return <CreditCard className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "social":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="flex flex-col border rounded-lg p-3 bg-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded">
            {getCategoryIcon(password.category)}
          </div>
          <div>
            <h3 className="font-medium leading-none">{password.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{password.username}</p>
          </div>
        </div>
        {showActions && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 h-8 w-8",
              password.favorite ? "text-amber-500" : "text-muted-foreground"
            )}
            onClick={() => toggleFavorite(password.id)}
          >
            <Star className="h-4 w-4" fill={password.favorite ? "currentColor" : "none"} />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <div className="relative flex-1 bg-muted rounded px-2 py-1">
          <p className={`text-xs font-mono ${showPassword ? "" : "tracking-widest"}`}>
            {showPassword ? password.password : "•".repeat(Math.min(12, password.password.length))}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => copyToClipboard(password.password, "Mot de passe")}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      {showActions && (
        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8">
              <Edit className="h-3 w-3 mr-1" />
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-destructive" 
              onClick={() => deletePassword(password.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
          </div>
          
          {password.website && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground"
              asChild
            >
              <a href={password.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Visiter
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordListItem;
