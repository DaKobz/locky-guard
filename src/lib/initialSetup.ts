/**
 * Script d'initialisation pour le premier démarrage de l'application
 */

/**
 * Supprime toutes les données stockées localement pour s'assurer que l'utilisateur 
 * démarre avec une installation fraîche et doit créer un mot de passe maître,
 * mais uniquement lors du premier démarrage.
 */
export const resetAppData = () => {
  try {
    // Vérifier si c'est la première exécution de l'application
    const isFirstRun = !localStorage.getItem("APP_INITIALIZED");
    
    if (isFirstRun) {
      console.log("Première exécution de l'application - réinitialisation des données");
      
      // Supprimer toutes les données d'authentification
      localStorage.removeItem("hasSetMasterPassword");
      localStorage.removeItem("masterPassword");
      
      // Marquer l'application comme initialisée pour ne pas répéter cette opération
      localStorage.setItem("APP_INITIALIZED", "true");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des données:", error);
    return false;
  }
};

/**
 * Réinitialise complètement l'application (pour le développement ou les tests)
 */
export const forceResetApp = () => {
  try {
    localStorage.clear();
    console.log("Application complètement réinitialisée");
    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation forcée:", error);
    return false;
  }
}; 