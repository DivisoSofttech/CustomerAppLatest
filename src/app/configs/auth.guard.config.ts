import { OAuthService, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';


export const authConfig: AuthConfig = {
  issuer: 'https://dev.servers.divisosofttech.com/auth/realms/graeshoppe',
  redirectUri: window.location.origin,
  clientId: 'account',
  scope: 'openid profile email voucher offline_access',
  dummyClientSecret: '61aed705-1f70-4955-ad23-94bc15c09c29',
  tokenEndpoint: 'https://dev.servers.divisosofttech.com/auth/realms/graeshoppe/protocol/openid-connect/token',
  userinfoEndpoint: 'https://dev.servers.divisosofttech.com/auth/realms/graeshoppe/protocol/openid-connect/userinfo',
  // oidc: false,
  requireHttps: false,
};


@Injectable()
export class AuthGuardConfig {

    constructor(
        private oauthService: OAuthService
    ) {
        this.configureWithNewConfigApi();
    }

    private configureWithNewConfigApi() {

        this.oauthService.configure(authConfig);
        this.oauthService.setStorage(localStorage);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();


        // Optional
        this.oauthService.setupAutomaticSilentRefresh();

        // this.oauthService.events.subscribe(e => {
        //   // tslint:disable-next-line:no-console
        //   console.debug('oauth/oidc event', e);
        // });

        // this.oauthService.events
        //   .pipe(filter(e => e.type === 'session_terminated'))
        //   .subscribe(e => {
        //     console.debug('Your session has been terminated!');
        //   });

        // this.oauthService.events
        //   .pipe(filter(e => e.type === 'token_received'))
        //   .subscribe(e => {
        //     // this.oauthService.loadUserProfile();
        //   });
    }
}
