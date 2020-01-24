import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  version;

  constructor(
    private modalController: ModalController,
    private appVersion: AppVersion
  ) { }

  ngOnInit() {
    this.getVersion();
  }

  getVersion() {
    this.version = this.appVersion.getVersionNumber()
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
