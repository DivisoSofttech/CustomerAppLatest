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
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

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
    private localNotifications: LocalNotifications
      ) {
    this.getUser();
    // if (typeof Worker !== 'undefined') {
    //   // Create a new
    //   const worker = new Worker('./user.worker', { type: 'module' });
    //   worker.onmessage = ({ data }) => {
    //     console.log(`page got message: ${data}`);
    //   };
    //   worker.postMessage('hello');
    // } else {
    //   // Web Workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    // }
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.localNotifications.hasPermission()) {
        console.log('Local Notifications has permission');
      } else {
        this.localNotifications.requestPermission().then(permission => {
          console.log('Permission has been granted', permission);
        });
      }
      // if (this.platform.is('android')) {
      //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_NOTIFICATION_POLICY).then(
      //     result => {console.log('Has permission?', result.hasPermission);
      //                console.log('Has Permission is true');},
      //     err => { this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_NOTIFICATION_POLICY]);
      //              console.log('In error has no permission');
      //     }
      //     );
      // }
      if (this.platform.is('pwa')) {
        console.log('Browser');
        this.browser = true;
      }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#e6e6e6');
      // Set orientation to portrait
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.backgroundMode.enable();

        // console.log('Backgorund mode status is enable', this.backgroundMode.isEnabled());


        this.backgroundMode.on('activate').subscribe(() => {
           console.log('activate background mode');
         });
        // console.log('Backgorund mode status is active', this.backgroundMode.isActive());

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
