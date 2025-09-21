import { Component, inject, signal } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'
import {
  scan
 } from 'ionicons/icons';
import { ScannerComponent } from '../modals/scanner/scanner.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonLabel, 
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ],
})
export class HomePage {

  private modalCtrl = inject(ModalController);
  
  public scannerModelOpen: boolean = false;
  
  private _scannedResult = signal<string>('');
  get scannedResult() {
    return this._scannedResult();
  }

  constructor() {
    addIcons({
      scan
    })
  }

  public openScanner = async () => {
    this.scannerModelOpen = !this.scannerModelOpen;
    const scannerModal = await this.modalCtrl.create({
      component: ScannerComponent
    });
    scannerModal.present();

    scannerModal.onDidDismiss().then((result => {
      const { data, role } = result;
      this.scannerModelOpen = !this.scannerModelOpen;
      this._scannedResult.set(data);
    }));
  }
}
