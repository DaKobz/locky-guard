import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lockyguard.app',
  appName: 'Locky Guard',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'nointernet',
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