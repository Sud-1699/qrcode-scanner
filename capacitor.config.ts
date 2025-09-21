import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'qrcode-scanner',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    },
    EdgeToEdge: {
      backgroundColor: "#000000",
    },
  }
};

export default config;
