import { Util } from './services/util';
import { KeycloakService } from './services/security/keycloak.service';
import { Component } from '@angular/core';

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

  showLogin = false;

  showLogout = false;

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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private util: Util,
    private storage: Storage,
    private keycloakService: KeycloakService,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getUser();
    });
  }

  getUser() {
    this.keycloakService.getUserChangedSubscription()
    .subscribe(user => {
      if(user !== null) {
        if (user.preferred_username === 'guest') {
          console.log('Show Login');
          this.showLogin = true;
          this.showLogout = false;
        } else {
          console.log('Show Logout');
          this.showLogin = false;
          this.showLogout = true;
        }
      } else {
        this.showLogin = true;
        this.showLogout = false;
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
