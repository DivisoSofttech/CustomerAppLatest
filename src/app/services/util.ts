import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController
} from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable()
export class Util {
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController
  ) {}

  async createLoader() {
    return await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000
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
