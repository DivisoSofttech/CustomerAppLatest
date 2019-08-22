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
import { RouteReuseStrategy } from '@angular/router';

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
import {environment} from '../environments/environment';
import { PayPal } from '@ionic-native/paypal/ngx';
import { LocationStrategy, HashLocationStrategy, Location } from '@angular/common';

@NgModule({

  declarations: [AppComponent],

  entryComponents: [],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    // Extra Modules
    ImageCropperModule,
    ConfigsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBdjkfcPlWTwnUq1W1YLIXMNJtMjdOXVXk',
      libraries: ['places', 'geometry']
    }),
    OAuthModule.forRoot(),
    LoggerModule.forRoot(environment.logging),
  ],

  providers: [
    Camera,
    StatusBar,
    Util,
    SplashScreen,
    PayPal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Extra Services
    LocationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    Geolocation,
    GoogleMapsAPIWrapper,
    FilterService,
    FavouriteService,
    CartService,
    OrderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
