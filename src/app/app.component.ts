import { NGXLogger } from 'ngx-logger';
import { Util } from './services/util';
import { KeycloakService } from './services/security/keycloak.service';
import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  guest = true;

  public appPages = [
    {
      title: 'Home',
      url: '/restaurant',
      icon: 'business'
    },
    {
      title: 'Basket',
      url: '/basket',
      icon: 'basket'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    }
  ];

  browser = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private util: Util,
    private logger: NGXLogger,
    private storage: Storage,
    private keycloakService: KeycloakService,
    private menuController: MenuController,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('pwa')) {
        console.log('Browser');
        this.browser = true;
      }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#e6e6e6');
      // Set orientation to portrait
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.splashScreen.hide();
      this.getUser();
    });
  }

  exitApp() {
    this.util.createAlert('Exit App', 'Are you sure?',
    (confirm) => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    }, (deny) => {
    });
  }


  getUser() {
    this.keycloakService.getUserChangedSubscription()
    .subscribe(user => {
      if (user !== null) {
        if (user.preferred_username === 'guest') {
          this.logger.info('Show Login');
          this.guest = true;
        } else {
          this.logger.info('Show Logout');
          this.guest = false;
        }
      } else {
        this.guest = true;
      }
    });
  }

  logout() {
    this.keycloakService.logout();
    this.util.createToast('You\'ve been logged out');
  }

  login() {
    this.util.navigateToLogin();
  }
}
