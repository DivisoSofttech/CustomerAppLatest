import { ProcessPaymentComponent } from './../components/process-payment/process-payment.component';
import { PaymentSuccessfullInfoComponent } from './../components/payment-successfull-info/payment-successfull-info.component';
import { Injectable } from '@angular/core';
import { ModalController, PopoverController, NavController } from '@ionic/angular';
import { WaitInformatonPopoverComponent } from '../components/wait-informaton-popover/wait-informaton-popover.component';
import { PaymentflowNavComponent } from '../components/paymentflow-nav/paymentflow-nav.component';

@Injectable({
  providedIn: 'root'
})
export class ModalDisplayUtilService {

  constructor(private modalController: ModalController,
              private popoverController: PopoverController,
              private navController: NavController) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ProcessPaymentComponent
    });
    return await modal.present();
  }

  async presentWaitInfoPopover() {
    const popover = await this.popoverController.create({
      component: WaitInformatonPopoverComponent
    });
    return await popover.present();
  }

  async presentPaymentSuccessfullInfo() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PaymentSuccessfullInfoComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }

  navigateToBasket() {
    this.navController.navigateForward('basket');
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
