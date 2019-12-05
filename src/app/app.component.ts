import { Util } from './services/util';
import { KeycloakService } from './services/security/keycloak.service';
import { Component, HostListener } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform,ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { GuestUserService } from './services/security/guest-user.service';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { Router, NavigationEnd } from '@angular/router';
import { LogService } from './services/log.service';
import {APP_SIDE_MENU} from './configs/app-side-menu';
import { RecentService } from './services/recent.service';
import { ErrorService } from './services/error.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  guest = true;

  appPages;

  browser = false;
  keyCloakUser: any;

  showFilter = false;

  showReview = false;

  store;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private util: Util,
    private logger: LogService,
    private errorService: ErrorService,
    private recentService: RecentService,
    private keycloakService: KeycloakService,
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation,
    private localNotifications: LocalNotifications,
    private router: Router,
    private guestUserService: GuestUserService,
  ) {

    this.getCurrentStore();
    this.appPages = APP_SIDE_MENU;
    this.toggleFilterView('/restaurant');
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.logger.info(this,'Current URL' , val.url);
        this.toggleFilterView(val.url);      
      }
    });

    this.getUser();
    this.initializeApp();
    if (this.platform.is('pwa') || this.platform.is('cordova')) {
      this.browser = true;
    }
    this.checkInternetConnection(this.errorService);
  }

  checkInternetConnection(errorService: ErrorService) {
    window.addEventListener('offline', function(event){
      errorService.setNetworkStatus(false);
      errorService.showErrorModal();
    });
    window.addEventListener('online', function(event){
      errorService.setNetworkStatus(true);
      errorService.modal.dismiss();
      this.location.reload();
    });
  }


  getCurrentStore() {
    this.recentService.getCurrentStore()
    .subscribe(data => {
      if(data !== null) {
        this.store = data;
      } else {
        this.store = null;
      }
    })
  }

  toggleFilterView(val) {
    if(window.innerWidth >= 1280)
    {    this.logger.info(this,'Current Route' , val);
        if(val==='/restaurant' || val==='/') {
          this.logger.info(this,'Turning On Filter View')
          this.showFilter = true;
          this.showReview = false;
        } 
        else if(val.slice(0,7)==='/store/'){
          this.logger.info(this,'Turning On Review View')
          this.showReview = true;
          this.showFilter = false;
        }else {
          this.logger.info(this,'Turning Off Filter View')
          this.showFilter = false;
          this.showReview = false;
        }
      }  else {
        this.logger.info(this,'Turning On Filter View Window Small')
        this.showFilter=false;
        this.showReview=false;
      }
  }

  @HostListener('window:resize', ['$event'])  
  onResize(event) {
    this.toggleFilterView(this.router.url);
  }

  getUser() {
    this.keycloakService.getUserChangedSubscription()
      .subscribe(user => {
        this.keyCloakUser = user;
        this.logger.info('Checking If guest : App Component', user );
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

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.localNotifications.hasPermission()) {
        this.logger.info('Local Notifications has permission');
      } else {
        this.localNotifications.requestPermission().then(permission => {
          this.logger.info('Permission has been granted', permission);
        });
      }
      if (this.platform.is('pwa')) {
        this.logger.info("Browser");
        this.browser = true;
      }
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#e6e6e6');
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      this.splashScreen.hide();
      this.getUser();
    });
  }

  exitApp() {
    this.util.createAlert('Exit App', 'Are you sure?',
      (confirm) => {
        navigator['app'].exitApp();
      }, (deny) => {
      });
  }

  async showPreviousOrders() {
    const modal = await this.modalController.create({
      component: HistoryListComponent,
      componentProps: { keyCloakUser: this.keyCloakUser, viewType: 'modal' }
    });
    await modal.present();
  }

  logout() {
    this.keycloakService.logout();
    this.util.createToast('You\'ve been logged out');
    this.guestUserService.logInGuest();
  }

  login() {
    this.util.navigateToLogin();
  }
}
