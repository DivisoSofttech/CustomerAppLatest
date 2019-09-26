import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  issuer: 'https://dev.servers.divisosofttech.com/auth/realms/sample',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  dummyClientSecret: 'a767ef54-8ff4-400a-8385-10a9cf864b24',

  tokenEndpoint: 'https://dev.servers.divisosofttech.com/auth/realms/sample/protocol/openid-connect/token',
  userinfoEndpoint: 'https://dev.servers.divisosofttech.com/auth/realms/sample/protocol/openid-connect/userinfo',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'account',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email voucher offline_access',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oauthService: OAuthService
  ) {
    this.initializeApp();
    this.configureOauth();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private configureOauth() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
