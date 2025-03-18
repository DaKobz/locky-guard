// Exemple de définition TypeScript pour le plugin FileSaver

import { Plugin } from '@capacitor/core';

export interface FileSaverPlugin extends Plugin {
  saveFile(options: {
    fileName: string;
    fileContent: string;
    encoding?: string;
    mimeType?: string;
  }): Promise<{
    uri: string;
    success: boolean;
  }>;
}

// Cette définition permettrait d'utiliser le plugin avec un typage approprié
// dans une application TypeScript avec Capacitor 