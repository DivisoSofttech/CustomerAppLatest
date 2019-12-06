import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
  AlertController
} from '@ionic/angular';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class Util {
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController,
    private alertCtrl: AlertController,
    private _snackBar: MatSnackBar
  ) {}

  async createLoader(duration?) {
    return await this.loadingController.create({
      spinner: 'lines',
      message: 'Please wait',
      duration: duration !== undefined?duration:100000,
      cssClass:'loader'
    });
  }

  async createCustomLoader(spinner, message) {
    return await this.loadingController.create({
      spinner:spinner === undefined?'circles':spinner,
      message
    });
  }

  createToast(msg: string, iconName?: string) {
    const width = window.innerWidth;

    if(width >= 1280) {
        this._snackBar.open(msg,'', {
          duration: 2000,
          horizontalPosition:'right',
          verticalPosition:'top'
        });
    } else {

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
