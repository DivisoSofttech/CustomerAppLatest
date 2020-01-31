import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { QueryResourceService } from 'src/app/api/services';
import { About } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  version;

  isBrowser;

  abouts: About[] = [];

  showLoading = true;

  constructor(
    private modalController: ModalController,
    private appVersion: AppVersion,
    private platform: Platform,
    private appRate: AppRate,
    private queryResourceService: QueryResourceService,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.getVersion();
    this.getPlatform();
    this.configureAppRate();
    this.fetchAbout(0);
  }

  getPlatform() {
    this.isBrowser = this.platform.is('pwa') || this.platform.is('mobileweb');
  }

  fetchAbout(i) {
    this.queryResourceService.findallaboutUsingGET({page: i})
    .subscribe(pageofabout=> {
      this.logger.info(this,pageofabout.content);
      pageofabout.content.forEach(about=> {
        this.abouts.push(about);
      });
      if(i < pageofabout.totalPages) {
        i++;
        this.fetchAbout(i)
      }
      this.showLoading = false;
    },
    err=> {
      this.showLoading = false;
    })

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
