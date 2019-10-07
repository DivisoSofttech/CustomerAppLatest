import { NGXLogger } from 'ngx-logger';
import { Util } from './services/util';
import { KeycloakService } from './services/security/keycloak.service';
import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OAuthService } from 'angular-oauth2-oidc';
import { NotificationService } from './services/notification.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';
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
    private screenOrientation: ScreenOrientation,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private oauthService: OAuthService,
    private notificationService: NotificationService,
    private androidPermissions: AndroidPermissions
   // public foregroundService: ForegroundService
      ) {
    this.getUser();
    this.initializeApp();
  }


  // startService() {
  //   // Notification importance is optional, the default is 1 - Low (no sound or vibration)
  //   this.foregroundService.start('Foodexp', 'Background Service', 'drawable/fsicon');
  //  }
  initializeApp() {
    // this.startService();
    this.platform.ready().then(() => {
      if (this.localNotifications.hasPermission()) {
        console.log('Local Notifications has permission');
      } else {
        this.localNotifications.requestPermission().then(permission => {
          console.log('Permission has been granted', permission);
        });
      }
      if (this.platform.is('pwa')) {
        console.log('Browser');
        this.browser = true;
      }
      if (this.platform.is('android')) {
        console.log('Checking permission foreground service android');
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.FOREGROUND_SERVICE)
        .then(
          result => {
            console.log('Has permission for foreground');
            console.log('Has permission?', result.hasPermission);
          },
          err => {
            console.log('Android has no permission for foreground service requesting ****');
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.FOREGROUND_SERVICE);
          });
      }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#e6e6e6');
      // Set orientation to portrait
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        // this.backgroundMode.enable();
        // this.backgroundMode.on('activate').subscribe(() => {
        //    console.log('activate background mode');
        //  });
      }
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
      this.logger.info('Checking If guest : App Component');
      if (user) {
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
