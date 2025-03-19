import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Available languages
export type Language = "fr" | "en";

// Context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string, params?: Record<string, any>) => key,
});

// Translations object
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Dashboard
    "dashboard": "Tableau de bord",
    "dashboard.subtitle": "Gérez vos mots de passe en toute sécurité",
    "total": "Total",
    "passwords.stored": "mots de passe enregistrés",
    "favorites": "Favoris",
    "favorite.passwords": "mots de passe favoris",
    "last.modified": "Dernière modification",
    "last.update.date": "date de dernière mise à jour",
    "vulnerable": "Vulnérables",
    "passwords.at.risk": "mots de passe à risque",
    "recent.passwords": "Mots de passe récents",
    "recent.passwords.subtitle": "Vos derniers mots de passe mis à jour",
    "categories": "Catégories",
    "categories.subtitle": "Répartition par type de mot de passe",
    "no.recent": "Aucun mot de passe récent",
    "view.all.passwords": "Voir tous les mots de passe",
    "no.category": "Aucune catégorie",
    
    // Password list
    "passwords": "Mots de passe",
    "passwords.subtitle": "Gérez tous vos mots de passe en toute sécurité",
    "add": "Ajouter",
    "search": "Rechercher...",
    "all.categories": "Toutes les catégories",
    "no.password.found": "Aucun mot de passe trouvé",
    "try.other.criteria": "Essayez avec d'autres critères de recherche",
    "add.first.password": "Ajoutez votre premier mot de passe",
    "add.password": "Ajouter un mot de passe",
    
    // Categories
    "website": "Site web",
    "application": "Application",
    "banking": "Bancaire",
    "email": "Email",
    "social": "Réseau social",
    "other": "Autre",
    
    // Favorites
    "favorites.title": "Favoris",
    "favorites.subtitle": "Vos mots de passe les plus importants",
    "no.favorites": "Aucun favori",
    "favorites.description": "Marquez vos mots de passe importants comme favoris pour y accéder rapidement",
    "view.all": "Voir tous les mots de passe",
    
    // Password generator
    "generator": "Générateur de mot de passe",
    "generator.subtitle": "Créez des mots de passe forts et uniques",
    "new.password": "Nouveau mot de passe",
    "generate.secure": "Générez un mot de passe sécurisé selon vos critères",
    "length": "Longueur",
    "include.uppercase": "Inclure des majuscules (A-Z)",
    "include.numbers": "Inclure des chiffres (0-9)",
    "include.special": "Inclure des caractères spéciaux (!@#$%^&*)",
    "password.strength": "Force du mot de passe:",
    "weak": "Faible",
    "medium": "Moyen",
    "strong": "Fort",
    "very.strong": "Très fort",
    "regenerate": "Régénérer",
    "security.tips": "Conseils de sécurité",
    "security.tips.subtitle": "Comment améliorer la sécurité de vos mots de passe",
    "tip.unique": "Utilisez des mots de passe uniques",
    "tip.unique.desc": "Ne réutilisez jamais le même mot de passe sur différents sites ou services.",
    "tip.length": "Longueur minimale",
    "tip.length.desc": "Utilisez au moins 12 caractères pour une sécurité optimale.",
    "tip.combination": "Combinaison variée",
    "tip.combination.desc": "Mélangez lettres majuscules, minuscules, chiffres et caractères spéciaux.",
    "tip.personal": "Évitez les informations personnelles",
    "tip.personal.desc": "Ne pas inclure votre nom, date de naissance ou d'autres informations facilement dévinables.",
    "how.to.use": "Comment utiliser ce générateur",
    "how.to.use.desc": "Ajustez les paramètres selon vos besoins, copiez le mot de passe généré et utilisez-le pour créer ou mettre à jour vos comptes.",
    
    // Add password
    "add.password.title": "Ajouter un mot de passe",
    "add.password.subtitle": "Créez une nouvelle entrée sécurisée",
    "title": "Titre",
    "title.placeholder": "ex: Gmail, Facebook, etc.",
    "category": "Catégorie",
    "username": "Nom d'utilisateur",
    "username.placeholder": "ex: utilisateur@email.com",
    "website.url": "Site web ou URL",
    "website.placeholder": "ex: https://example.com",
    "password": "Mot de passe",
    "password.placeholder": "Mot de passe sécurisé",
    "generate": "Générer",
    "mark.favorite": "Marquer comme favori",
    "notes": "Notes",
    "notes.placeholder": "Informations supplémentaires (numéro de compte, code PIN, etc.)",
    "cancel": "Annuler",
    "save": "Enregistrer",
    
    // Password item
    "password.copied": "Mot de passe copié dans le presse-papiers",
    "edit": "Modifier",
    "delete": "Supprimer",
    "visit": "Visiter",
    
    // Login page
    "app.name": "Locky Guard",
    "app.subtitle": "Gestionnaire de mots de passe sécurisé",
    "login": "Connexion",
    "login.subtitle": "Entrez votre mot de passe pour accéder à vos données",
    "login.description": "Entrez votre mot de passe principal pour accéder à vos données",
    "main.password": "Mot de passe principal",
    "master.password": "Mot de passe maître",
    "enter.master.password": "Entrez votre mot de passe maître",
    "password.required": "Le mot de passe est requis",
    "logging.in": "Connexion en cours...",
    "authenticating": "Authentification...",
    "unlock": "Déverrouiller",
    "use.biometrics": "Utiliser la biométrie",
    "data.security": "Locky Guard stocke vos données en sécurité uniquement sur votre appareil.",
    "create.master.password": "Création du mot de passe maître",
    "create.master.password.description": "Veuillez créer un mot de passe maître fort pour sécuriser vos données",
    "new.master.password": "Nouveau mot de passe maître",
    "confirm.master.password": "Confirmer le mot de passe maître",
    "master.password.placeholder": "Choisissez un mot de passe fort",
    "password.strength.weak": "Faible - Ajoutez des caractères spéciaux, chiffres et majuscules",
    "password.strength.medium": "Moyen - Ajoutez une autre catégorie de caractères",
    "password.strength.strong": "Fort - Bon choix de mot de passe",
    "password.mismatch": "Les mots de passe ne correspondent pas",
    "password.too.weak": "Veuillez choisir un mot de passe plus fort",
    "password.too.short": "Le mot de passe doit contenir au moins 6 caractères",
    "password.creation.error": "Une erreur est survenue lors de la création du mot de passe",
    "create.and.unlock": "Créer et déverrouiller",
    "creating": "Création en cours",
    "master.password.warning": "Ce mot de passe est la clé de votre coffre-fort. Notez-le quelque part de sûr car il est impossible de le récupérer en cas d'oubli.",
    "master.password.warning.title": "Important",
    "forgot.password": "Mot de passe oublié ? Réinitialiser",
    "reset.data.confirmation": "ATTENTION : Cette action supprimera toutes vos données et réinitialisera l'application. Vous devrez créer un nouveau mot de passe maître. Continuer ?",
    "reset.data.success": "Toutes les données ont été supprimées avec succès. L'application va redémarrer.",
    "reset.data.permanent": "Cette action est définitive. Toutes vos données seront perdues sans possibilité de récupération.",
    "legal.info": "Informations légales",
    
    // Header & Sidebar
    "search.placeholder": "Rechercher...",
    "my.account": "Mon compte",
    "settings": "Paramètres",
    "logout": "Déconnexion",
    "all.passwords": "Tous les mots de passe",
    "data.secure": "Vos données sont sécurisées et stockées uniquement sur votre appareil",
    
    // Theme toggle
    "switch.light": "Passer au mode clair",
    "switch.dark": "Passer au mode sombre",
    "change.theme": "Changer de thème",
    
    // Loading
    "loading": "Chargement...",
    
    // Backup Page
    "backup": "Sauvegarde",
    "backup.local.title": "Sauvegarde locale",
    "backup.local.description": "Sauvegardez vos données sur votre appareil",
    "backup.local": "Sauvegarder en local",
    "backup.local.success": "Sauvegarde locale réussie",
    "backup.local.error": "Erreur lors de la sauvegarde locale",
    "restore.local": "Restaurer depuis un fichier local",
    "restore.local.success": "Restauration locale réussie",
    "restore.local.error": "Erreur lors de la restauration locale",
    "backup.master_password_required": "Le mot de passe maître est nécessaire pour cette opération",
    "restore.wrong_master_password": "Impossible de déchiffrer le fichier. Vérifiez que vous utilisez le bon mot de passe maître.",
    "restore.invalid_format": "Format de fichier de sauvegarde non valide. Le fichier semble corrompu.",
    "restore.invalid_json": "Le fichier déchiffré ne contient pas de données JSON valides.",
    "security.note": "Note de sécurité",
    "security.backup.description": "Vos sauvegardes sont chiffrées, mais nous vous recommandons de les stocker dans un endroit sécurisé. Ne partagez jamais vos fichiers de sauvegarde avec des tiers.",
    "encryption.note": "Chiffrement",
    "encryption.backup.description": "Vos sauvegardes sont chiffrées avec votre mot de passe maître. Seule cette application avec le bon mot de passe peut les déchiffrer.",
    
    // Legal Page
    "legal.information": "Informations légales",
    "legal.privacy": "Politique de confidentialité",
    "legal.terms": "Conditions générales d'utilisation",
    "legal.legal": "Informations juridiques",
    "legal.security": "Protection et chiffrement",
    "privacy": "Vie privée",
    "terms": "CGU",
    "legal.notice": "Mentions légales",
    "data.security.title": "Sécurité des données",
    "back": "Retour",
    
    // Legal Pages - Privacy Policy
    "privacy.policy.title": "Politique de confidentialité",
    "privacy.policy.intro": "Locky s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.",
    "privacy.data.collection.title": "Collecte et utilisation des données",
    "privacy.data.collection.text": "Locky est un gestionnaire de mots de passe local qui stocke toutes les données directement sur votre appareil. Nous ne collectons aucune donnée personnelle sur nos serveurs. Les seules données collectées sont :",
    "privacy.data.collection.item1": "Les mots de passe et informations que vous choisissez de stocker dans l'application.",
    "privacy.data.collection.item2": "Les paramètres de l'application que vous configurez.",
    "privacy.data.collection.encryption": "Ces données sont stockées localement sur votre appareil et chiffrées à l'aide d'un algorithme AES-256.",
    "privacy.storage.title": "Autorisation d'accès au stockage",
    "privacy.storage.text": "L'application demande l'autorisation d'accéder au stockage de votre appareil uniquement pour permettre les fonctionnalités de sauvegarde et de restauration locales.",
    "privacy.security.title": "Sécurité des données",
    "privacy.security.text": "Nous utilisons des mesures de sécurité avancées pour protéger vos données :",
    "privacy.security.item1": "Chiffrement AES-256 pour toutes les données sensibles.",
    "privacy.security.item2": "Utilisation de l'Android Keystore System pour la gestion des clés.",
    "privacy.security.item3": "Authentification biométrique ou par mot de passe maître.",
    "privacy.rights.title": "Vos droits",
    "privacy.rights.text": "Vous avez le contrôle total sur vos données. Vous pouvez à tout moment les modifier, les supprimer ou les exporter depuis l'application.",
    
    // Legal Pages - Terms of Service
    "terms.title": "Conditions générales d'utilisation",
    "terms.acceptance.title": "Acceptation des conditions",
    "terms.acceptance.text": "En utilisant l'application Locky, vous acceptez d'être lié par ces conditions générales d'utilisation.",
    "terms.description.title": "Description du service",
    "terms.description.text": "Locky est un gestionnaire de mots de passe local pour Android qui stocke et chiffre vos données sur votre appareil.",
    "terms.usage.title": "Utilisation de l'application",
    "terms.usage.text": "Vous êtes responsable de maintenir la confidentialité de votre mot de passe maître et de toutes les activités qui se produisent sous votre compte.",
    "terms.ip.title": "Propriété intellectuelle",
    "terms.ip.text": "L'application Locky et tous ses contenus sont protégés par les lois sur la propriété intellectuelle.",
    "terms.liability.title": "Limitation de responsabilité",
    "terms.liability.text": "Nous ne sommes pas responsables de la perte de données résultant d'une mauvaise utilisation de l'application ou de la perte de votre appareil.",
    "terms.changes.title": "Modifications des CGU",
    "terms.changes.text": "Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications seront effectives dès leur publication dans l'application.",
    
    // Legal Pages - Legal Notice
    "legal.notice.title": "Mentions légales",
    "legal.notice.editor": "Éditeur :",
    "legal.notice.editor.value": "Dakobz",
    "legal.notice.address": "Adresse :",
    "legal.notice.address.value": "10 Rue du merlot 33520 Bruges",
    "legal.notice.contact": "Contact :",
    "legal.notice.contact.value": "Dakobz.creator@gmail.com",
    "legal.notice.director": "Directeur de la publication :",
    "legal.notice.director.value": "Chennebault",
    "legal.notice.hosting": "Hébergement :",
    "legal.notice.hosting.value": "Application mobile - Google Play Store",
    
    // Legal Pages - Data Security
    "data.security.page.title": "Informations sur la sécurité des données",
    "data.security.page.intro": "Locky utilise les meilleures pratiques en matière de sécurité pour protéger vos données :",
    "data.security.page.item1": "Chiffrement AES-256 pour toutes les données stockées.",
    "data.security.page.item2": "Utilisation de l'Android Keystore System pour une gestion sécurisée des clés.",
    "data.security.page.item3": "Verrouillage automatique après une période d'inactivité dans l'application.",
    
    // Plan Pro et paiements
    "pro.upgrade.title": "Passez à Locky Pro",
    "pro.upgrade.subtitle": "Débloquez toutes les fonctionnalités et profitez d'un accès illimité",
    "pro.upgrade.already": "Vous profitez déjà de Locky Pro",
    "pro.active.title": "Locky Pro est actif",
    "pro.active.subtitle": "Vous profitez de toutes les fonctionnalités premium",
    "pro.feature.unlimited": "Mots de passe illimités",
    "pro.feature.backup": "Sauvegarde et restauration avancées",
    "pro.feature.sync": "Synchronisation entre appareils",
    "pro.feature.support": "Support prioritaire",
    "pro.feature.security": "Analyses de sécurité avancées",
    "free.plan.title": "Version Gratuite",
    "free.plan.subtitle": "Fonctionnalités de base",
    "pro.plan.title": "Locky Pro",
    "pro.plan.subtitle": "Accès complet à vie",
    "password.limit": "Limite de mots de passe",
    "passwords.remaining": "Mots de passe restants",
    "price": "Prix",
    "payment.one.time.info": "Paiement unique, accès à vie",
    "one.time.payment.info": "Paiement unique, sans abonnement. Accès à toutes les fonctionnalités Pro à vie sur tous vos appareils.",
    "support.email": "Support : support@locky.app",
    "continue": "Continuer",
    "pay.once.browser": "Acheter maintenant (1,99 €)",
    "pay.once.stripe": "Payer avec Stripe (1,99 €)",
    "restore.purchases": "Restaurer mes achats",
    "free.plan.status": "Version gratuite",
    "freeplanremaining": "{{count}} mots de passe restants",
    "upgradetopro": "Passer à la version Pro",
    "purchase.success": "Achat réussi ! Vous avez maintenant un accès illimité.",
    "purchase.error": "Une erreur est survenue lors de la préparation du paiement.",
    "purchase.browser.redirect": "Le paiement s'ouvrira dans votre navigateur. Revenez à l'application une fois terminé.",
    "purchase.login.required": "Vous devez être connecté pour effectuer cet achat",
    "purchase.loading": "Traitement de votre paiement...",
    "restore.loading": "Vérification de vos achats en cours...",
    "restore.success": "Vos achats ont été restaurés avec succès !",
    "restore.not.found": "Aucun achat trouvé associé à votre compte. Si vous avez déjà acheté Locky Pro, assurez-vous d'utiliser le même compte qu'au moment de l'achat.",
    "restore.error": "Erreur lors de la restauration des achats. Veuillez vérifier votre connexion internet et réessayer.",
    "restore.login.required": "Vous devez être connecté pour restaurer vos achats",
    "auto.restore.success": "Votre achat Locky Pro a été automatiquement restauré !",
    "subscription.expired": "Votre abonnement a expiré. Vous pouvez le renouveler pour continuer à bénéficier de toutes les fonctionnalités.",
    
    // Messages
    "password.limit.reached": "Limite de mots de passe atteinte. Passez à la version Pro pour en ajouter davantage.",
    "password.added": "Mot de passe ajouté avec succès",
    "password.updated": "Mot de passe mis à jour",
    "password.deleted": "Mot de passe supprimé",
    "password.creation.error": "Une erreur est survenue lors de la création du mot de passe",
    
    // Authentication messages
    "password.creation.success": "Mot de passe maître créé avec succès",
    "create.master.password.first": "Veuillez créer un mot de passe maître d'abord",
    "authentication.error.missing.config": "Erreur d'authentification : configuration manquante",
    "authentication.success": "Authentification réussie",
    "incorrect.password": "Mot de passe incorrect",
    "authentication.error": "Erreur lors de l'authentification",
    "logout.success": "Vous êtes déconnecté",
  },
  en: {
    // Dashboard
    "dashboard": "Dashboard",
    "dashboard.subtitle": "Manage your passwords securely",
    "total": "Total",
    "passwords.stored": "stored passwords",
    "favorites": "Favorites",
    "favorite.passwords": "favorite passwords",
    "last.modified": "Last Modified",
    "last.update.date": "last update date",
    "vulnerable": "Vulnerable",
    "passwords.at.risk": "passwords at risk",
    "recent.passwords": "Recent Passwords",
    "recent.passwords.subtitle": "Your recently updated passwords",
    "categories": "Categories",
    "categories.subtitle": "Distribution by password type",
    "no.recent": "No recent passwords",
    "view.all.passwords": "View all passwords",
    "no.category": "No categories",
    
    // Password list
    "passwords": "Passwords",
    "passwords.subtitle": "Manage all your passwords securely",
    "add": "Add",
    "search": "Search...",
    "all.categories": "All categories",
    "no.password.found": "No password found",
    "try.other.criteria": "Try with other search criteria",
    "add.first.password": "Add your first password",
    "add.password": "Add password",
    
    // Categories
    "website": "Website",
    "application": "Application",
    "banking": "Banking",
    "email": "Email",
    "social": "Social Network",
    "other": "Other",
    
    // Favorites
    "favorites.title": "Favorites",
    "favorites.subtitle": "Your most important passwords",
    "no.favorites": "No favorites",
    "favorites.description": "Mark your important passwords as favorites for quick access",
    "view.all": "View all passwords",
    
    // Password generator
    "generator": "Password Generator",
    "generator.subtitle": "Create strong and unique passwords",
    "new.password": "New Password",
    "generate.secure": "Generate a secure password based on your criteria",
    "length": "Length",
    "include.uppercase": "Include uppercase letters (A-Z)",
    "include.numbers": "Include numbers (0-9)",
    "include.special": "Include special characters (!@#$%^&*)",
    "password.strength": "Password strength:",
    "weak": "Weak",
    "medium": "Medium",
    "strong": "Strong",
    "very.strong": "Very strong",
    "regenerate": "Regenerate",
    "security.tips": "Security Tips",
    "security.tips.subtitle": "How to improve your password security",
    "tip.unique": "Use unique passwords",
    "tip.unique.desc": "Never reuse the same password across different websites or services.",
    "tip.length": "Minimum length",
    "tip.length.desc": "Use at least 12 characters for optimal security.",
    "tip.combination": "Varied combination",
    "tip.combination.desc": "Mix uppercase letters, lowercase letters, numbers, and special characters.",
    "tip.personal": "Avoid personal information",
    "tip.personal.desc": "Do not include your name, birth date, or other easily guessable information.",
    "how.to.use": "How to use this generator",
    "how.to.use.desc": "Adjust the parameters according to your needs, copy the generated password, and use it to create or update your accounts.",
    
    // Add password
    "add.password.title": "Add Password",
    "add.password.subtitle": "Create a new secure entry",
    "title": "Title",
    "title.placeholder": "e.g., Gmail, Facebook, etc.",
    "category": "Category",
    "username": "Username",
    "username.placeholder": "e.g., user@email.com",
    "website.url": "Website or URL",
    "website.placeholder": "e.g., https://example.com",
    "password": "Password",
    "password.placeholder": "Secure password",
    "generate": "Generate",
    "mark.favorite": "Mark as favorite",
    "notes": "Notes",
    "notes.placeholder": "Additional information (account number, PIN code, etc.)",
    "cancel": "Cancel",
    "save": "Save",
    
    // Password item
    "password.copied": "Password copied to clipboard",
    "edit": "Edit",
    "delete": "Delete",
    "visit": "Visit",
    
    // Login page
    "app.name": "Locky Guard",
    "app.subtitle": "Secure Password Manager",
    "login": "Login",
    "login.subtitle": "Enter your password to access your data",
    "login.description": "Enter your master password to access your data",
    "main.password": "Master password",
    "master.password": "Master password",
    "enter.master.password": "Enter your master password",
    "password.required": "Password is required",
    "logging.in": "Logging in...",
    "authenticating": "Authenticating...",
    "unlock": "Unlock",
    "use.biometrics": "Use biometrics",
    "data.security": "Locky Guard stores your data securely only on your device.",
    "create.master.password": "Create master password",
    "create.master.password.description": "Please create a strong master password to secure your data",
    "new.master.password": "New master password",
    "confirm.master.password": "Confirm master password",
    "master.password.placeholder": "Choose a strong password",
    "password.strength.weak": "Weak - Add special characters, numbers and uppercase",
    "password.strength.medium": "Medium - Add another category of characters",
    "password.strength.strong": "Strong - Good password choice",
    "password.mismatch": "Passwords don't match",
    "password.too.weak": "Please choose a stronger password",
    "password.too.short": "Password must be at least 6 characters",
    "password.creation.error": "An error occurred while creating the password",
    "create.and.unlock": "Create and unlock",
    "creating": "Creating",
    "master.password.warning": "This password is the key to your vault. Write it down somewhere safe as it cannot be recovered if forgotten.",
    "master.password.warning.title": "Important",
    "forgot.password": "Forgot password? Reset",
    "reset.data.confirmation": "WARNING: This action will delete all your data and reset the application. You will need to create a new master password. Continue?",
    "reset.data.success": "All data has been successfully deleted. The application will restart.",
    "reset.data.permanent": "This action is permanent. All your data will be lost without the possibility of recovery.",
    "legal.info": "Legal information",
    
    // Header & Sidebar
    "search.placeholder": "Search...",
    "my.account": "My account",
    "settings": "Settings",
    "logout": "Logout",
    "all.passwords": "All passwords",
    "data.secure": "Your data is secure and stored only on your device",
    
    // Theme toggle
    "switch.light": "Switch to light mode",
    "switch.dark": "Switch to dark mode",
    "change.theme": "Change theme",
    
    // Loading
    "loading": "Loading...",
    
    // Backup Page
    "backup": "Backup",
    "backup.local.title": "Local Backup",
    "backup.local.description": "Backup your data to your device",
    "backup.local": "Backup to local file",
    "backup.local.success": "Local backup successful",
    "backup.local.error": "Local backup failed",
    "restore.local": "Restore from local file",
    "restore.local.success": "Local restore successful",
    "restore.local.error": "Local restore failed",
    "backup.master_password_required": "Master password is required for this operation",
    "restore.wrong_master_password": "Unable to decrypt file. Please check that you are using the correct master password.",
    "restore.invalid_format": "Invalid backup file format. The file appears to be corrupted.",
    "restore.invalid_json": "The decrypted file does not contain valid JSON data.",
    "security.note": "Security Note",
    "security.backup.description": "Your backups are encrypted, but we recommend storing them in a secure location. Never share your backup files with third parties.",
    "encryption.note": "Encryption",
    "encryption.backup.description": "Your backups are encrypted with your master password. Only this application with the correct password can decrypt them.",
    
    // Legal Page
    "legal.information": "Legal Information",
    "legal.privacy": "Privacy Policy",
    "legal.terms": "Terms of Service",
    "legal.legal": "Legal Information",
    "legal.security": "Data Protection and Encryption",
    "privacy": "Privacy",
    "terms": "Terms",
    "legal.notice": "Legal Notice",
    "data.security.title": "Data Security",
    "back": "Back",
    
    // Legal Pages - Privacy Policy
    "privacy.policy.title": "Privacy Policy",
    "privacy.policy.intro": "Locky is committed to protecting your privacy and personal data. This privacy policy explains how we collect, use, and protect your information.",
    "privacy.data.collection.title": "Data Collection and Usage",
    "privacy.data.collection.text": "Locky is a local password manager that stores all data directly on your device. We do not collect any personal data on our servers. The only data collected are:",
    "privacy.data.collection.item1": "The passwords and information you choose to store in the application.",
    "privacy.data.collection.item2": "The application settings you configure.",
    "privacy.data.collection.encryption": "This data is stored locally on your device and encrypted using AES-256 algorithm.",
    "privacy.storage.title": "Storage Access Permission",
    "privacy.storage.text": "The application requests permission to access your device's storage only to enable local backup and restore features.",
    "privacy.security.title": "Data Security",
    "privacy.security.text": "We use advanced security measures to protect your data:",
    "privacy.security.item1": "AES-256 encryption for all sensitive data.",
    "privacy.security.item2": "Use of the Android Keystore System for key management.",
    "privacy.security.item3": "Biometric or master password authentication.",
    "privacy.rights.title": "Your Rights",
    "privacy.rights.text": "You have complete control over your data. You can modify, delete, or export it from the application at any time.",
    
    // Legal Pages - Terms of Service
    "terms.title": "Terms of Service",
    "terms.acceptance.title": "Acceptance of Terms",
    "terms.acceptance.text": "By using the Locky application, you agree to be bound by these terms of service.",
    "terms.description.title": "Service Description",
    "terms.description.text": "Locky is a local password manager for Android that stores and encrypts your data on your device.",
    "terms.usage.title": "Application Usage",
    "terms.usage.text": "You are responsible for maintaining the confidentiality of your master password and for all activities that occur under your account.",
    "terms.ip.title": "Intellectual Property",
    "terms.ip.text": "The Locky application and all its contents are protected by intellectual property laws.",
    "terms.liability.title": "Limitation of Liability",
    "terms.liability.text": "We are not responsible for data loss resulting from misuse of the application or loss of your device.",
    "terms.changes.title": "Changes to Terms",
    "terms.changes.text": "We reserve the right to modify these Terms at any time. Changes will be effective upon posting in the application.",
    
    // Legal Pages - Legal Notice
    "legal.notice.title": "Legal Notice",
    "legal.notice.editor": "Publisher:",
    "legal.notice.editor.value": "Dakobz",
    "legal.notice.address": "Address:",
    "legal.notice.address.value": "10 Rue du merlot 33520 Bruges",
    "legal.notice.contact": "Contact:",
    "legal.notice.contact.value": "Dakobz.creator@gmail.com",
    "legal.notice.director": "Publication Director:",
    "legal.notice.director.value": "Chennebault",
    "legal.notice.hosting": "Hosting:",
    "legal.notice.hosting.value": "Mobile Application - Google Play Store",
    
    // Legal Pages - Data Security
    "data.security.page.title": "Data Security Information",
    "data.security.page.intro": "Locky uses best security practices to protect your data:",
    "data.security.page.item1": "AES-256 encryption for all stored data.",
    "data.security.page.item2": "Use of Android Keystore System for secure key management.",
    "data.security.page.item3": "Automatic locking after a period of inactivity in the application.",
    
    // Plan Pro et paiements
    "pro.upgrade.title": "Upgrade to Locky Pro",
    "pro.upgrade.subtitle": "Unlock all features and enjoy unlimited access",
    "pro.upgrade.already": "You're already enjoying Locky Pro",
    "pro.active.title": "Locky Pro is Active",
    "pro.active.subtitle": "You have access to all premium features",
    "pro.feature.unlimited": "Unlimited passwords",
    "pro.feature.backup": "Advanced backup & restore",
    "pro.feature.sync": "Cross-device synchronization",
    "pro.feature.support": "Priority support",
    "pro.feature.security": "Advanced security analysis",
    "free.plan.title": "Free Version",
    "free.plan.subtitle": "Basic features",
    "pro.plan.title": "Locky Pro",
    "pro.plan.subtitle": "Lifetime access",
    "password.limit": "Password limit",
    "passwords.remaining": "Passwords remaining",
    "price": "Price",
    "payment.one.time.info": "One-time payment, lifetime access",
    "one.time.payment.info": "One-time payment, no subscription. Lifetime access to all Pro features across all your devices.",
    "support.email": "Support: support@locky.app",
    "continue": "Continue",
    "pay.once.browser": "Buy now (1,99 €)",
    "pay.once.stripe": "Pay with Stripe (1,99 €)",
    "restore.purchases": "Restore purchases",
    "free.plan.status": "Free version",
    "freeplanremaining": "{{count}} passwords remaining",
    "upgradetopro": "Upgrade to Pro",
    "purchase.success": "Purchase successful! You now have unlimited access.",
    "purchase.error": "An error occurred while processing your payment.",
    "purchase.browser.redirect": "Payment will open in your browser. Return to the app once completed.",
    "purchase.login.required": "You must be logged in to make this purchase",
    "purchase.loading": "Processing your payment...",
    "restore.loading": "Checking your purchases...",
    "restore.success": "Your purchases have been successfully restored!",
    "restore.not.found": "No purchases found associated with your account. If you've already purchased Locky Pro, make sure you're using the same account as when you made the purchase.",
    "restore.error": "Error restoring purchases. Please check your internet connection and try again.",
    "restore.login.required": "You must be logged in to restore purchases",
    "auto.restore.success": "Your Locky Pro purchase has been automatically restored!",
    "subscription.expired": "Your subscription has expired. You can renew it to continue enjoying all features.",
    
    // Messages
    "password.limit.reached": "Password limit reached. Upgrade to Pro to add more passwords.",
    "password.added": "Password successfully added",
    "password.updated": "Password updated",
    "password.deleted": "Password deleted",
    "password.creation.error": "An error occurred while creating the password",
    
    // Authentication messages
    "password.creation.success": "Master password successfully created",
    "create.master.password.first": "Please create a master password first",
    "authentication.error.missing.config": "Authentication error: missing configuration",
    "authentication.success": "Authentication successful",
    "incorrect.password": "Incorrect password",
    "authentication.error": "Authentication error",
    "logout.success": "You are logged out",
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "fr"; // Default to French
  });

  useEffect(() => {
    // Save the language preference to localStorage when it changes
    localStorage.setItem("language", language);
  }, [language]);

  // Provide a translation function
  const t = (key: string, params?: Record<string, any>): string => {
    // First try to get the translation from the current language
    let translation = translations[language][key];
    
    // If a translation is found, replace any params
    if (translation && params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    // If a translation is found, return it
    if (translation) return translation;
    
    // If not found in the current language, try fallback to English
    if (language !== "en") {
      let fallbackTranslation = translations["en"][key];
      
      // Replace params in fallback translation
      if (fallbackTranslation && params) {
        Object.keys(params).forEach(param => {
          fallbackTranslation = fallbackTranslation.replace(`{{${param}}}`, params[param]);
        });
      }
      
      if (fallbackTranslation) return fallbackTranslation;
    }
    
    // If still not found, return the key itself
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => useContext(LanguageContext);
