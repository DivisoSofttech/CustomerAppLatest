import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorComponent } from '../components/error/error.component';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  component;
  modal: HTMLIonModalElement;
  isOnline = true;

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger
  ) { }

  refresh() {
    this.modalController.dismiss();
    this.component.ngOnInit();
  }

  checkNetworkStatus() {
    if(navigator.onLine) {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
  }

  async showErrorModal(component?) {

    this.checkNetworkStatus();
    this.component = component;
    this.modal = await this.modalController.create({
    component: ErrorComponent,
    componentProps: {isOnline: this.isOnline},
    cssClass:['full'],
    backdropDismiss: false
    });

    this.modal.onDidDismiss()
    .then(()=> {
      if(this.component) {
        this.component.ngOnInit();
      } else {
        location.reload();
      }
    })
  
    await this.modal.present();
  
  }
}
