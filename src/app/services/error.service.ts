import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorComponent } from '../components/error/error.component';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {


  isOnline = true;

  constructor(
    private modalController: ModalController,
    private logger: LogService
  ) { }


  checkCurrentNetworkStatus() {
    if (navigator.onLine) {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
    this.logger.info(this, 'Network Available', this.isOnline);
  }

  async showErrorModal(reset) {

    this.checkCurrentNetworkStatus();
    const modal = await this.modalController.create({
      component: ErrorComponent,
      componentProps: { isOnline: this.isOnline },
      cssClass: ['full'],
      backdropDismiss: false
    });

    modal.onDidDismiss()
      .then(() => {
        reset()
      })
    await modal.present();

  }
}
