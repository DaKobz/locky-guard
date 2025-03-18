
import React, { useState, useEffect } from "react";
import { usePasswords } from "@/context/PasswordContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check, Shield, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PasswordGenerator: React.FC = () => {
  const { generatePassword } = usePasswords();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  
  useEffect(() => {
    generateNewPassword();
  }, []);
  
  const generateNewPassword = () => {
    const newPassword = generatePassword(
      length,
      includeUppercase,
      includeNumbers,
      includeSpecialChars
    );
    setPassword(newPassword);
    setCopied(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success(t("password.copied"));
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const calculatePasswordStrength = (): { 
    strength: "weak" | "medium" | "strong" | "very-strong", 
    label: string,
    color: string 
  } => {
    let score = 0;
    
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSpecialChars) score += 1;
    
    if (score <= 2) return { strength: "weak", label: t("weak"), color: "bg-red-500" };
    if (score <= 4) return { strength: "medium", label: t("medium"), color: "bg-yellow-500" };
    if (score <= 5) return { strength: "strong", label: t("strong"), color: "bg-green-500" };
    return { strength: "very-strong", label: t("very.strong"), color: "bg-green-700" };
  };
  
  const strength = calculatePasswordStrength();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("generator")}</h1>
        <p className="text-muted-foreground">
          {t("generator.subtitle")}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("new.password")}</CardTitle>
            <CardDescription>
              {t("generate.secure")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                value={password}
                readOnly
                className="font-mono pr-20 text-base h-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={generateNewPassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="length">{t("length")}: {length}</Label>
                <span className="text-sm text-muted-foreground">(8-30)</span>
              </div>
              <Slider
                id="length"
                min={8}
                max={30}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                className="mb-6"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase" className="cursor-pointer">
                  {t("include.uppercase")}
                </Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers" className="cursor-pointer">
                  {t("include.numbers")}
                </Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="specialChars" className="cursor-pointer">
                  {t("include.special")}
                </Label>
                <Switch
                  id="specialChars"
                  checked={includeSpecialChars}
                  onCheckedChange={setIncludeSpecialChars}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="space-y-1">
              <Label>{t("password.strength")}</Label>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`${strength.color} h-2 rounded-full transition-all`}
                  style={{ width: `${(strength.strength === "weak" ? 25 : strength.strength === "medium" ? 50 : strength.strength === "strong" ? 75 : 100)}%` }}
                />
              </div>
              <p className="text-xs">{strength.label}</p>
            </div>
            <Button onClick={generateNewPassword}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("regenerate")}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("security.tips")}</CardTitle>
            <CardDescription>
              {t("security.tips.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t("tip.unique")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("tip.unique.desc")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t("tip.length")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("tip.length.desc")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t("tip.combination")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("tip.combination.desc")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t("tip.personal")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("tip.personal.desc")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t("how.to.use")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("how.to.use.desc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordGenerator;
