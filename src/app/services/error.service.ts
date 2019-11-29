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

  setNetworkStatus(val) {
    this.isOnline = val;
  }

  async showErrorModal(component?) {

    if(this.modal !== undefined) {
      this.modalController.dismiss();
    }
    this.logger.info('Showing Error Modal');
    this.component = component;
    this.modal = await this.modalController.create({
    component: ErrorComponent,
    componentProps: {isOnline: this.isOnline},
    cssClass:['full'],
    backdropDismiss: false
    });

    this.modal.onDidDismiss()
    .then(()=> {
      this.component.ngOnInit();
    })
  
    await this.modal.present();
  
  }
}
