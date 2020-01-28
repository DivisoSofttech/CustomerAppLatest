import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  version;

  isBrowser;

  constructor(
    private modalController: ModalController,
    private appVersion: AppVersion,
    private platform: Platform,
    private appRate: AppRate    
  ) { }

  ngOnInit() {
    this.getVersion();
    this.getPlatform();
    this.configureAppRate();
  }

  getPlatform() {
    this.isBrowser = this.platform.is('pwa') || this.platform.is('mobileweb');
  }

  configureAppRate() {
    this.appRate.preferences = {
      usesUntilPrompt: 3,
      storeAppURL: {
       ios: '<app_id>',
       android: 'market://details?id=<package_name>',
       windows: 'ms-windows-store://review/?ProductId=<store_id>'
      }
    }
  }
  getVersion() {
    this.appVersion.getVersionNumber().then(versionNumber => {
      this.version = versionNumber;
    })
  }

  rateApp() {
    this.appRate.promptForRating(true);
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
