import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private platform = inject(Platform);

  constructor() {
    this.platform.ready().then(() => {
      this.enable();
      this.setBackgroundColor()
    })
  }

  private enable = async () => {
    await EdgeToEdge.enable();
  };

  private setBackgroundColor = async () => {
    await EdgeToEdge.setBackgroundColor({ color: '#000000' });
    await StatusBar.setStyle({ style: Style.Dark });
  };
}
