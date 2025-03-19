/// <reference types="@capacitor/core" />

// Type pour les plugins personnalisés de Capacitor
declare module '@capacitor/core' {
  interface PluginRegistry {
    FileSaver: FileSaverPlugin;
  }
}

// Interface pour le plugin FileSaver
interface FileSaverPlugin {
  saveFile(options: {
    fileName: string;
    fileContent: string;
    mimeType?: string;
    encoding?: 'base64' | 'utf8';
  }): Promise<{ uri: string; success: boolean }>;
} 