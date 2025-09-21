import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { 
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  ModalController,
  IonIcon,
  AlertController
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { camera, close } from 'ionicons/icons';
import { scannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  imports: [IonIcon,  
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonIcon
  ]
})
export class ScannerComponent  implements OnInit {

  public content_visibility: string = '';

  private _squareEl = viewChild<ElementRef<HTMLDivElement>>('square');
  get sqaureEl() {
    return this._squareEl();
  }

  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private scannerService = inject(scannerService);

  constructor() { 
    addIcons({
      close
    })
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.startScanner();
  }

  public cancel = () => {
    this.stopScanner();
    this.modalCtrl.dismiss(null, "cancel");
  }

  private startScanner = async() => {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        const alert = await this.alertCtrl.create({
          header: 'Permission Required',
          message: 'Please enable permissions for scanner access'
        });

        alert.present();
        alert.onDidDismiss().then(() => {
          this.enablePermission();
        });
      }

      this.content_visibility = 'hidden';
      if(this.sqaureEl) this.sqaureEl.nativeElement.style.display = 'block';
      const squareElBoundingClientRect = this.sqaureEl!.nativeElement.getBoundingClientRect();
      const scaledRect = squareElBoundingClientRect ? {
        left: squareElBoundingClientRect.left * window.devicePixelRatio,
        right: squareElBoundingClientRect.right * window.devicePixelRatio,
        top: squareElBoundingClientRect.top * window.devicePixelRatio,
        bottom: squareElBoundingClientRect.bottom * window.devicePixelRatio,
        width: squareElBoundingClientRect.width * window.devicePixelRatio,
        height: squareElBoundingClientRect.height * window.devicePixelRatio,
      } : undefined;

      const detectionCornerPoints = scaledRect ? [
        [scaledRect.left, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top + scaledRect.height],
        [scaledRect.left, scaledRect.top + scaledRect.height]
      ] : undefined;

      this.scannerService.startScan([BarcodeFormat.QrCode], detectionCornerPoints).then(result => {
        if(result && Object.keys(result).length) {
          console.log('startScanner: result: ', result);
          const value = result[0].rawValue;
          this.stopScanner();
          if(value) {
            this.modalCtrl.dismiss(value, 'done');
          }
        }
      })
    } catch (error) {
      this.stopScanner();
    }
  }

  private stopScanner = () => {
    this.scannerService.stopScan();
    this.content_visibility = '';
  }

  private checkPermission = (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      this.scannerService.checkPermission().then(camera => {
        if (camera === 'granted' || camera === 'limited') resolve(true);
        else resolve(false);
      });
    });
  }

  private enablePermission = async () => {
    this.scannerService.requestPermission().then(camera => {
      if(camera !== "granted") this.scannerService.openScannerSettings();
    });
  }
}
