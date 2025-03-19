import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fonction pour gérer les erreurs globales
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Erreur globale:', message, source, lineno, colno, error);
  
  // Afficher un message d'erreur sur la page
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h2>Une erreur s'est produite :</h2>
        <p>${message}</p>
        <p>Source: ${source}, ligne: ${lineno}, colonne: ${colno}</p>
        <p>Veuillez recharger la page ou contactez l'assistance.</p>
      </div>
    `;
  }
  
  return true; // Empêche l'affichage de l'erreur par défaut
};

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("L'élément root n'existe pas dans le DOM");
  }
  createRoot(root).render(<App />);
} catch (error) {
  console.error("Erreur lors du montage de l'application:", error);
  
  // Afficher un message d'erreur sur la page
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h2>Erreur lors du démarrage de l'application :</h2>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>Veuillez recharger la page ou contactez l'assistance.</p>
      </div>
    `;
  }
}
