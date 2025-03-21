import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { useLanguage, Language } from '@/context/LanguageContext';

const STRIPE_API_URL = 'https://us-central1-VOTRE_PROJET_ID.cloudfunctions.net/createCheckout';
const STRIPE_VERIFY_URL = 'https://us-central1-VOTRE_PROJET_ID.cloudfunctions.net/checkSubscription';
const STRIPE_PAYMENT_URL = 'https://us-central1-VOTRE_PROJET_ID.cloudfunctions.net/checkPayment';

const BACKEND_ENABLED = false;

const PRICE_AMOUNT = 199;
const PRICE_DISPLAY = '1,99 €';
const PRICE_DISPLAY_EN = '$1.99';
const PRODUCT_ID = 'prod_RxsrL8CqlOy08Z';

const PASSWORD_LIMIT_EVENT = 'passwordLimitUpdate';
const PASSWORD_COUNT_EVENT = 'passwordCountUpdate';

interface PurchaseContextProps {
  isProUser: boolean;
  currentPrice: { 
    priceString: string; 
    price: number; 
    currencyCode: string; 
  };
  isLoading: boolean;
  initializePurchases: () => Promise<void>;
  purchaseProViaStripe: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  getPasswordLimit: () => number;
  canAddPassword: () => boolean;
  isNativePlatform: boolean;
}

const PurchaseContext = createContext<PurchaseContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "pro.upgrade.title": "Passez à Locky Pro",
    "pro.upgrade.subtitle": "Débloquez toutes les fonctionnalités",
    "pro.active.title": "Locky Pro Actif",
    "pro.active.subtitle": "Vous profitez de toutes les fonctionnalités",
    "pro.feature.unlimited": "Mots de passe illimités",
    "pro.feature.backup": "Sauvegarde et restauration",
    "free.plan.title": "Version Gratuite",
    "free.plan.subtitle": "Fonctionnalités de base",
    "free.plan.remaining": "{{count}} mots de passe restants",
    "pro.plan.title": "Version Pro",
    "pro.plan.subtitle": "Toutes les fonctionnalités",
    "password.limit": "Limite de mots de passe",
    "passwords.remaining": "Mots de passe restants",
    "price": "Prix",
    "payment.one.time.info": "Paiement unique, accès à vie",
    "one.time.payment.info": "Paiement unique, accès à vie. Aucun abonnement.",
    "continue": "Continuer",
    "pay.once.browser": "Acheter maintenant (1,99€)",
    "pay.once.stripe": "Payer avec Stripe (1,99€)",
    "restore.purchases": "Restaurer mes achats",
    "restore.login.required": "Vous devez être connecté pour restaurer vos achats",
    "restore.loading": "Vérification de vos achats en cours...",
    "restore.success": "Vos achats ont été restaurés avec succès !",
    "restore.not.found": "Aucun achat trouvé associé à votre compte. Si vous avez déjà acheté Locky Pro, assurez-vous d'utiliser le même compte qu'au moment de l'achat.",
    "restore.error": "Erreur lors de la restauration des achats. Veuillez vérifier votre connexion internet et réessayer.",
    "auto.restore.success": "Votre achat Locky Pro a été automatiquement restauré !",
    "subscription.expired": "Votre abonnement a expiré. Vous pouvez le renouveler pour continuer à bénéficier de toutes les fonctionnalités.",
    "pro.expired": "Période d'essai expirée",
    "pro.active": "Pro actif",
    "freeplanremaining": "{{count}} mots de passe restants",
    "success.restored": "Pro restauré",
    "pro.inactive": "Pro inactif",
    "free": "Version gratuite",
    "upgrade.required": "Mise à niveau requise",
    "pro.upgrade.already": "Vous bénéficiez déjà de toutes les fonctionnalités"
  },
  en: {
    "pro.upgrade.title": "Upgrade to Locky Pro",
    "pro.upgrade.subtitle": "Unlock all features",
    "pro.active.title": "Locky Pro Active",
    "pro.active.subtitle": "You're enjoying all premium features",
    "pro.feature.unlimited": "Unlimited passwords",
    "pro.feature.backup": "Backup & restore",
    "free.plan.title": "Free Version",
    "free.plan.subtitle": "Basic features",
    "free.plan.remaining": "{{count}} passwords remaining",
    "pro.plan.title": "Pro Version",
    "pro.plan.subtitle": "All features",
    "password.limit": "Password limit",
    "passwords.remaining": "Passwords remaining",
    "price": "Price",
    "payment.one.time.info": "One-time payment, lifetime access",
    "one.time.payment.info": "One-time payment, lifetime access. No subscription.",
    "continue": "Continue",
    "pay.once.browser": "Buy now ($1.99)",
    "pay.once.stripe": "Pay with Stripe ($1.99)",
    "restore.purchases": "Restore purchases",
    "restore.login.required": "You must be logged in to restore your purchases",
    "restore.loading": "Checking your purchases...",
    "restore.success": "Your purchases have been successfully restored!",
    "restore.not.found": "No purchase found associated with your account. If you've already purchased Locky Pro, make sure you're using the same account as when you made the purchase.",
    "restore.error": "Error restoring purchases. Please check your internet connection and try again.",
    "auto.restore.success": "Your Locky Pro purchase has been automatically restored!",
    "subscription.expired": "Your subscription has expired. You can renew it to continue enjoying all features.",
    "pro.expired": "Trial period expired",
    "pro.active": "Pro active",
    "freeplanremaining": "{{count}} passwords remaining",
    "success.restored": "Pro restored",
    "pro.inactive": "Pro inactive",
    "free": "Free version",
    "upgrade.required": "Upgrade required",
    "purchase.login.required": "You must be logged in to make this purchase",
    "purchase.success": "Purchase successful! You now have unlimited access.",
    "purchase.error": "An error occurred while processing your payment.",
    "purchase.browser.redirect": "Payment will open in your browser. Return to the app once completed.",
    "pro.upgrade.already": "You already have access to all features"
  }
};

console.log("PurchaseContext: Initialisation du contexte");

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("PurchaseProvider: Rendu du provider");
  const { isAuthenticated, masterPassword } = useAuth();
  const { t, language } = useLanguage();
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNativePlatform, setIsNativePlatform] = useState<boolean>(false);
  const [currentPasswordCount, setCurrentPasswordCount] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState({
    priceString: language === 'en' ? PRICE_DISPLAY_EN : PRICE_DISPLAY,
    price: PRICE_AMOUNT / 100,
    currencyCode: language === 'en' ? 'USD' : 'EUR'
  });

  const getPasswordLimit = () => {
    return isProUser ? Infinity : 3;
  };

  const canAddPassword = () => {
    return isProUser;
  };

  useEffect(() => {
    const event = new CustomEvent(PASSWORD_LIMIT_EVENT, {
      detail: {
        limit: getPasswordLimit(),
        canAdd: canAddPassword()
      }
    });
    window.dispatchEvent(event);
  }, [isProUser]);

  useEffect(() => {
    const handlePasswordCountUpdate = (event: CustomEvent) => {
      setCurrentPasswordCount(event.detail.count);
    };

    window.addEventListener(PASSWORD_COUNT_EVENT, handlePasswordCountUpdate as EventListener);
    return () => {
      window.removeEventListener(PASSWORD_COUNT_EVENT, handlePasswordCountUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    setCurrentPrice({
      priceString: language === 'en' ? PRICE_DISPLAY_EN : PRICE_DISPLAY,
      price: PRICE_AMOUNT / 100,
      currencyCode: language === 'en' ? 'USD' : 'EUR'
    });
  }, [language]);

  const initializePurchases = async () => {
    try {
      setIsLoading(true);
      
      try {
        const isNative = Capacitor.isNativePlatform();
        setIsNativePlatform(isNative);
      } catch (e) {
        console.error('Erreur lors de la vérification de la plateforme:', e);
        setIsNativePlatform(false);
      }
      
      const hasPurchasedLocally = localStorage.getItem('locky_pro_purchased') === 'true';
      
      if (hasPurchasedLocally) {
        setIsProUser(true);
      }
      
      if (masterPassword && BACKEND_ENABLED) {
        try {
          const response = await fetch(`${STRIPE_VERIFY_URL}?user_id=${encodeURIComponent(masterPassword)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000)
          });
          
          const data = await response.json();
          
          if (response.ok && data.active) {
            setIsProUser(true);
            localStorage.setItem('locky_pro_purchased', 'true');
            if (!hasPurchasedLocally) {
              toast.success(t('auto.restore.success') || 'Votre achat Locky Pro a été automatiquement restauré !');
            }
          } else if (hasPurchasedLocally) {
            localStorage.removeItem('locky_pro_purchased');
            setIsProUser(false);
            
            if (data.expired) {
              toast.info(t('subscription.expired') || "Votre abonnement a expiré. Vous pouvez le renouveler pour continuer à bénéficier de toutes les fonctionnalités.");
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut d\'abonnement:', error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des achats', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseProViaStripe = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!masterPassword) {
        toast.error(t('purchase.login.required') || 'Vous devez être connecté pour effectuer cet achat');
        setIsLoading(false);
        return false;
      }
      
      if (!BACKEND_ENABLED) {
        if (isNativePlatform) {
          window.open('https://example.com/payment-simulation', '_system');
          toast.info(t('purchase.browser.redirect') || "Le paiement s'ouvrira dans votre navigateur. Revenez à l'application une fois terminé.");
          
          setTimeout(() => {
            localStorage.setItem('locky_pro_purchased', 'true');
            setIsProUser(true);
            toast.success(t('purchase.success') || 'Achat réussi ! Vous avez maintenant un accès illimité.');
          }, 5000);
          
          setIsLoading(false);
          return false;
        } else {
          window.location.href = '/payment-success?session_id=test_session_id';
          setIsLoading(false);
          return false;
        }
      }
      
      const response = await fetch(STRIPE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: masterPassword,
          amount: PRICE_AMOUNT,
          productName: language === 'en' ? 'Locky Pro - Lifetime Access' : 'Locky Pro - Accès à vie',
          productId: PRODUCT_ID,
          platform: isNativePlatform ? 'android' : 'web',
          returnUrl: window.location.origin + '/payment-success'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('purchase.error') || 'Erreur lors de la création de la session de paiement');
      }
      
      if (isNativePlatform) {
        window.open(data.url, '_system');
        toast.info(t('purchase.browser.redirect') || "Le paiement s'ouvrira dans votre navigateur. Revenez à l'application une fois terminé.");
      } else {
        window.location.href = data.url;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'achat via Stripe', error);
      toast.error(t('purchase.error') || 'Une erreur est survenue lors de la préparation du paiement');
      setIsLoading(false);
      return false;
    }
  };

  const checkStripePaymentStatus = async (sessionId: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${STRIPE_PAYMENT_URL}?session_id=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('locky_pro_purchased', 'true');
        setIsProUser(true);
        toast.success('Achat réussi ! Vous avez maintenant un accès illimité.');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkPaymentResult = () => {
      try {
        if (window.location.pathname === '/payment-success') {
          const url = new URL(window.location.href);
          const sessionId = url.searchParams.get('session_id');
          
          if (sessionId && BACKEND_ENABLED) {
            checkStripePaymentStatus(sessionId);
            
            window.history.replaceState({}, document.title, '/');
          } else if (sessionId) {
            localStorage.setItem('locky_pro_purchased', 'true');
            setIsProUser(true);
            toast.success('Achat réussi ! Vous avez maintenant un accès illimité.');
            
            window.history.replaceState({}, document.title, '/');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du résultat de paiement:', error);
      }
    };
    
    checkPaymentResult();
  }, []);

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!masterPassword) {
        toast.error(t('restore.login.required') || 'Vous devez être connecté pour restaurer vos achats');
        setIsLoading(false);
        return false;
      }
      
      toast.info(t('restore.loading') || 'Vérification de vos achats en cours...');
      
      if (!BACKEND_ENABLED) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('locky_pro_purchased', 'true');
        setIsProUser(true);
        toast.success(t('restore.success') || 'Vos achats ont été restaurés avec succès !');
        setIsLoading(false);
        return true;
      }
      
      const response = await fetch(`${STRIPE_VERIFY_URL}?user_id=${encodeURIComponent(masterPassword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.active) {
        setIsProUser(true);
        localStorage.setItem('locky_pro_purchased', 'true');
        toast.success(t('restore.success') || 'Vos achats ont été restaurés avec succès !');
        setIsLoading(false);
        return true;
      } else {
        localStorage.removeItem('locky_pro_purchased');
        setIsProUser(false);
        toast.info(t('restore.not.found') || 'Aucun achat trouvé associé à votre compte. Si vous avez déjà acheté Locky Pro, assurez-vous d\'utiliser le même compte qu\'au moment de l\'achat.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des achats', error);
      toast.error(t('restore.error') || 'Erreur lors de la restauration des achats. Veuillez vérifier votre connexion internet et réessayer.');
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("PurchaseProvider: Démarrage de l'initialisation");
    try {
      initializePurchases().catch(error => {
        console.error('Erreur lors de l\'initialisation des achats:', error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Exception lors de l\'initialisation des achats:', error);
      setIsLoading(false);
    }
    console.log("PurchaseProvider: Fin de l'effet d'initialisation");
  }, [masterPassword]);

  return (
    <PurchaseContext.Provider
      value={{
        isProUser,
        currentPrice,
        isLoading,
        initializePurchases,
        purchaseProViaStripe,
        restorePurchases,
        getPasswordLimit,
        canAddPassword,
        isNativePlatform,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
};
