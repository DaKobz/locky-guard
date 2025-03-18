import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Shield, Eye, EyeOff, HelpCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const LoginPage: React.FC = () => {
  const { login, isLoading, isFirstLogin, setMasterPassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  
  const checkPasswordStrength = (pwd: string): "weak" | "medium" | "strong" => {
    if (!pwd || pwd.length < 8) return "weak";
    
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);
    
    const score = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (score <= 2) return "weak";
    if (score === 3) return "medium";
    return "strong";
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFirstLogin) {
      if (password !== confirmPassword) {
        alert(t("password.mismatch"));
        return;
      }
      
      if (passwordStrength === "weak") {
        alert(t("password.too.weak"));
        return;
      }
      
      await setMasterPassword(password);
    } else {
      await login(password);
    }
  };
  
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-gray-200";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/legal")}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-center">{t("app.name")}</h1>
          <p className="text-muted-foreground mt-1 text-center">{t("app.subtitle")}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isFirstLogin ? t("create.master.password") : t("login")}</CardTitle>
            <CardDescription>
              {isFirstLogin 
                ? t("create.master.password.description")
                : t("login.description")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid gap-4">
                {isFirstLogin && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{t("master.password.warning.title")}</AlertTitle>
                    <AlertDescription>
                      {t("master.password.warning")}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">{isFirstLogin ? t("new.master.password") : t("main.password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isFirstLogin ? t("master.password.placeholder") : t("main.password")}
                      value={password}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  
                  {isFirstLogin && (
                    <>
                      <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
                        <div 
                          className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                          style={{ width: passwordStrength ? `${(passwordStrength === "weak" ? 33 : passwordStrength === "medium" ? 66 : 100)}%` : "0%" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {passwordStrength === "weak" && t("password.strength.weak")}
                        {passwordStrength === "medium" && t("password.strength.medium")}
                        {passwordStrength === "strong" && t("password.strength.strong")}
                      </p>
                      
                      <div className="mt-4">
                        <Label htmlFor="confirmPassword">{t("confirm.master.password")}</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("confirm.master.password")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                          />
                        </div>
                        {password && confirmPassword && password !== confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">{t("password.mismatch")}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {!isFirstLogin && (
                  <div className="text-xs text-muted-foreground">
                    {t("demo.tip")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || (isFirstLogin && (password !== confirmPassword || !passwordStrength || passwordStrength === "weak"))}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">{isFirstLogin ? t("creating") : t("authenticating")}</span>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    {isFirstLogin ? t("create.and.unlock") : t("unlock")}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-xs text-center mt-8 text-muted-foreground">
          {t("data.security")}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
