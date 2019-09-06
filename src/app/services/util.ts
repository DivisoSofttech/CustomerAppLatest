import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
  ModalController,
  AlertController
} from '@ionic/angular';

@Injectable()
export class Util {
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController,
    private modalController: ModalController,
    private alertCtrl: AlertController
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
    this.navController.navigateRoot('restaurant');
  }

  async createAlert(header: string, message: string, onConfirm?: any, onDeny?: any) {
    const alert = await this.alertCtrl.create({
        header,
        message,
        buttons : [
            {
                text: 'Cancel',
                handler: () => {
                    if (onDeny) {
                        onDeny();
                    }
                }
            },
            {
                text: 'Okay',
                handler: () => {
                    if (onConfirm) {
                        onConfirm();
                    }
                }
            }
        ]
    });
    await alert.present();
}
}
