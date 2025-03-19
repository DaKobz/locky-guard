import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lockyguard.app',
  appName: 'Locky Guard',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Remplacer nointernet par localhost pour permettre le chargement local
    hostname: 'localhost',
    iosScheme: 'none',
    cleartext: false
  },
  android: {
    buildOptions: {
      releaseType: 'RELEASE'
    }
  }
};

export default config; 