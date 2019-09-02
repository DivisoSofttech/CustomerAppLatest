import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
  ModalController,
  PopoverController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { MakePaymentComponent } from '../components/make-payment/make-payment.component';
import { PaymentSuccessfullInfoComponent } from '../components/payment-successfull-info/payment-successfull-info.component';
import { WaitInformatonPopoverComponent } from '../components/wait-informaton-popover/wait-informaton-popover.component';

@Injectable()
export class Util {
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {}

  async createLoader() {
    return await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000
    });
  }

  async createCustomLoader(spinner, message) {
    return await this.loadingController.create({
      spinner,
      duration: 5000,
      message
    });
  }

  createToast(msg: string, iconName?: string) {
    this.toastController
      .create({
        message: msg,
        duration: 2000,
        color: 'dark',
        position: 'bottom',
        showCloseButton: true,
        keyboardClose: true,
        buttons: [
          {
            side: 'start',
            icon:
              iconName !== undefined ? iconName : 'information-circle-outline'
          }
        ]
      })
      .then(data => {
        data.present();
      });
  }

  navigateRoot() {
    this.navController.navigateRoot('');
  }

  navigateToLogin() {
    this.navController.navigateRoot('login');
  }

  navigateHome() {
    this.navController.navigateForward('restaurant');
  }
}
