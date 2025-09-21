import { inject, Injectable, NgZone } from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  ScanOptions
} from '@capacitor-mlkit/barcode-scanning';
import { PluginListenerHandle } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class scannerService {
  private scannerListener!: PluginListenerHandle;
  
  private ngZone = inject(NgZone);

  public startScan = (formats: BarcodeFormat[], detectionCornerPoints?: number[][] | undefined): Promise<Barcode[]> => {
    return new Promise(async (resolve, reject) => {
      this.addScannerClass();

      this.scannerListener = await BarcodeScanner.addListener(
        'barcodesScanned',
        async ({ barcodes }) => {
          this.ngZone.run(() => {
            const cornerPoints = barcodes[0].cornerPoints;
            if(detectionCornerPoints && cornerPoints) {
              if(
                detectionCornerPoints[0][0] > cornerPoints[0][0] ||
                detectionCornerPoints[0][1] > cornerPoints[0][1] ||
                detectionCornerPoints[1][0] < cornerPoints[1][0] ||
                detectionCornerPoints[1][1] > cornerPoints[1][1] ||
                detectionCornerPoints[2][0] < cornerPoints[2][0] ||
                detectionCornerPoints[2][1] < cornerPoints[2][1] ||
                detectionCornerPoints[3][0] > cornerPoints[3][0] ||
                detectionCornerPoints[3][1] < cornerPoints[3][1]
              ) return;
            }

            console.log(`starScan:: barcodes: `, barcodes);
            this.scannerListener.remove();
            resolve(barcodes);
          });
        }
      );

      const options: ScanOptions = {
        formats: formats
      };
      await BarcodeScanner.startScan(options);
    });
  }

  public stopScan = async () => {
    try {
      this.removeScannerClass();
      await BarcodeScanner.removeAllListeners();
      await BarcodeScanner.stopScan();
    } catch (error) {
     throw new Error("No scanner is open");
    }
  }

  public openScannerSettings = async () => await BarcodeScanner.openSettings();

  public readonly addScannerClass = () => document.querySelector('body')?.classList.add('scanner-active');

  public readonly removeScannerClass = () => document.querySelector('body')?.classList.add('scanner-inactive');

  public readonly checkPermission = async () => {
    const { camera } = await BarcodeScanner.checkPermissions();
    return camera;
  }

  public readonly requestPermission = async () => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera;
  }

  public readonly isScannerSupported = async () => {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }
}
