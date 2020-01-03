import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorComponent } from '../components/error/error.component';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  modal: HTMLIonModalElement;
  isOnline = true;

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger
  ) { }


  checkNetworkStatus() {
    if(navigator.onLine) {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
  }

  async showErrorModal(reset) {

    this.checkNetworkStatus();
    this.modal = await this.modalController.create({
    component: ErrorComponent,
    componentProps: {isOnline: this.isOnline},
    cssClass:['full'],
    backdropDismiss: false
    });

    this.modal.onDidDismiss()
    .then(()=> {
      reset()
    })
  
    await this.modal.present();
  
  }
}
