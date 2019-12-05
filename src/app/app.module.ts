import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CartService } from './services/cart.service';
import { FavouriteService } from './services/favourite.service';
import { FilterService } from './services/filter.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationService } from './services/location-service';
import { ImageCropperModule } from 'ngx-img-cropper';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './services/security/auth-interceptor';
import { ConfigsModule } from './configs/configs.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, UrlHandlingStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Util } from './services/util';
import { Camera } from '@ionic-native/camera/ngx';
import { ComponentsModule } from './components/components.module';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { OrderService } from './services/order.service';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { PayPal } from '@ionic-native/paypal/ngx';
import { LocationStrategy, HashLocationStrategy, Location, DecimalPipe } from '@angular/common';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Sim } from '@ionic-native/sim/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { BannerComponent } from './components/banner/banner.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ErrorService } from './services/error.service';
import { DirectiveModule } from './directives/directive.module';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { SharedDataService } from './services/shared-data.service';
import { RecentService } from './services/recent.service';
import { LogService } from './services/log.service';
import { PaymentNavService } from './services/payment-nav.service';

const config: SocketIoConfig = { url: 'https://dev.ci2.divisosofttech.com:9999', options: {} };

@NgModule({

  declarations: [AppComponent],

  entryComponents: [BannerComponent, NotificationComponent, HistoryListComponent],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    // Extra Modules
    ImageCropperModule,
    LoadingBarHttpClientModule,
    ConfigsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDgCo5uoS1ziWYwxC_urPwZBIP-pO2geRY',
      libraries: ['places', 'geometry']
    }),
    OAuthModule.forRoot(),
    LoggerModule.forRoot(environment.logging),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DirectiveModule
  ],

  providers: [
    Camera,
    StatusBar,
    ScreenOrientation,
    Util,
    SplashScreen,
    DecimalPipe,
    LocalNotifications,
    AndroidPermissions,
    BackgroundMode,
    // ForegroundService,
    PayPal,
    Sim,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Extra Services
    LocationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    Geolocation,
    GoogleMapsAPIWrapper,
    { provide: PaymentNavService, useClass: PaymentNavService },
    FilterService,
    FavouriteService,
    OrderService,
    CartService,
    DecimalPipe,
    RecentService,
    ErrorService,
    LogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    SharedDataService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
