import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PasswordProvider } from "@/context/PasswordContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import PasswordList from "@/pages/PasswordList";
import Favorites from "@/pages/Favorites";
import PasswordGenerator from "@/pages/PasswordGenerator";
import AddPassword from "@/pages/AddPassword";
import NotFound from "@/pages/NotFound";
import BackupPage from "@/pages/BackupPage";
import ProUpgrade from "@/pages/ProUpgrade";
import PaymentSuccess from "@/pages/PaymentSuccess";
import LegalPage from "@/pages/LegalPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import LegalNoticePage from "@/pages/legal/LegalNoticePage";
import DataSecurityPage from "@/pages/legal/DataSecurityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <PurchaseProvider>
              <PasswordProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/legal" element={<LegalPage />} />
                    <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/legal/terms" element={<TermsOfServicePage />} />
                    <Route path="/legal/notice" element={<LegalNoticePage />} />
                    <Route path="/legal/security" element={<DataSecurityPage />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="*" element={
                      <AppLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/passwords" element={<PasswordList />} />
                          <Route path="/favorites" element={<Favorites />} />
                          <Route path="/generator" element={<PasswordGenerator />} />
                          <Route path="/add" element={<AddPassword />} />
                          <Route path="/backup" element={<BackupPage />} />
                          <Route path="/pro" element={<ProUpgrade />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppLayout>
                    } />
                  </Routes>
                </BrowserRouter>
              </PasswordProvider>
            </PurchaseProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
