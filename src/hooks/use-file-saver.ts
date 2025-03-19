import { Capacitor } from '@capacitor/core';

/**
 * Hook pour sauvegarder des fichiers, compatible avec les plateformes web et natives
 */
export const useFileSaver = () => {
  const isNativePlatform = Capacitor.isNativePlatform();

  /**
   * Sauvegarde un fichier sur l'appareil
   * @param fileName - Nom du fichier à enregistrer
   * @param fileContent - Contenu du fichier (chaîne)
   * @param options - Options supplémentaires (type MIME, encodage)
   * @returns Promise<boolean> - true si sauvegarde réussie, false sinon
   */
  const saveFile = async (
    fileName: string,
    fileContent: string,
    options: { mimeType?: string; encoding?: 'base64' | 'utf8' } = {}
  ): Promise<boolean> => {
    try {
      // Vérifier si nous sommes sur une plateforme native
      if (isNativePlatform) {
        // Utiliser le plugin FileSaver sur les plateformes natives
        // @ts-ignore - Capacitor.Plugins est global et inclura tous les plugins
        const fileSaver = Capacitor.Plugins.FileSaver;
        
        if (!fileSaver) {
          console.error('FileSaver plugin not available');
          return false;
        }
        
        const result = await fileSaver.saveFile({
          fileName,
          fileContent,
          mimeType: options.mimeType || 'application/octet-stream',
          encoding: options.encoding || 'utf8'
        });
        
        return result.success;
      } else {
        // Sur le web, utiliser l'API File System Access si disponible
        if (window.showSaveFilePicker) {
          const blob = new Blob(
            [options.encoding === 'base64' ? atob(fileContent) : fileContent],
            { type: options.mimeType || 'application/octet-stream' }
          );
          
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'Locky Password Encrypted File',
              accept: { 'application/octet-stream': ['.pwe'] }
            }]
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          
          return true;
        } else {
          // Fallback pour les navigateurs qui ne supportent pas l'API File System Access
          const blob = new Blob(
            [options.encoding === 'base64' ? atob(fileContent) : fileContent],
            { type: options.mimeType || 'application/octet-stream' }
          );
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          return true;
        }
      }
    } catch (error) {
      console.error("Error saving file:", error);
      return false;
    }
  };

  return { saveFile, isNativePlatform };
}; 