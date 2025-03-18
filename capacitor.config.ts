import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lockyguard.app',
  appName: 'Locky Guard',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config; 