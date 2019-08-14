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
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({

  declarations: [AppComponent],

  entryComponents: [CheckoutComponent],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    // Extra Modules
    ImageCropperModule,
    ConfigsModule,
    ComponentsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDE6vwyjr_HUlyzP6EU4rsNxd_xchtBA1o',
      libraries: ['places', 'geometry']
    }),
    OAuthModule.forRoot()
  ],

  providers: [
    Camera,
    StatusBar,
    Util,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Extra Services
    LocationService,
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
