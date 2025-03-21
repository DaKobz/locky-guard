Exemple de code JavaScript pour utiliser le plugin:

// Importez Capacitor
import { Plugins } from '@capacitor/core';

// Fonction pour sauvegarder un fichier avec sélection d'emplacement
async function sauvegarderFichier(contenu, nomFichier = 'backup.json', mimeType = 'application/json') {
  try {
    // Conversion du contenu en base64 si nécessaire
    let contenuBase64 = btoa(contenu);
    
    // Appel du plugin natif
    const { FileSaver } = Plugins;
    const resultat = await FileSaver.saveFile({
      fileName: nomFichier,
      fileContent: contenuBase64,
      encoding: 'base64',
      mimeType: mimeType
    });
    
    if (resultat.success) {
      console.log('Fichier sauvegardé avec succès à:', resultat.uri);
      return true;
    } else {
      console.error('Échec de la sauvegarde');
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
}

// Exemple d'utilisation dans votre interface utilisateur
document.getElementById('boutonSauvegarder').addEventListener('click', async () => {
  // Récupérer les données à sauvegarder (par exemple, mots de passe)
  const donnees = {
    motsDePasse: [
      { site: 'exemple.com', utilisateur: 'utilisateur1', password: 'mdp123' },
      { site: 'autre-site.com', utilisateur: 'utilisateur2', password: 'secret456' }
    ],
    dateExport: new Date().toISOString()
  };
  
  // Convertir en JSON
  const contenuJSON = JSON.stringify(donnees, null, 2);
  
  // Sauvegarder le fichier
  const resultat = await sauvegarderFichier(contenuJSON, 'locky_guard_backup.json');
  
  if (resultat) {
    // Afficher un message de succès
    alert('Sauvegarde réussie !');
  } else {
    // Afficher un message d'erreur
    alert('Échec de la sauvegarde. Veuillez réessayer.');
  }
});
