import { Platform } from '@ionic/angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserObject, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  token;
  constructor(
    private oauthService: OAuthService,
    private platform: Platform,
    private iab: InAppBrowser) {
  }

  private InitAppLogin() {
    this.doAppLogin().then(success => {
      console.log('oauth success object', success);
      const idToken = success.id_token;
      const accessToken = success.access_token;
      const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
      console.log('kayValuePair', keyValuePair);
      this.oauthService.loadDiscoveryDocumentAndTryLogin({
        customHashFragment: keyValuePair,
        disableOAuth2StateCheck: true
      }).then(response => {
        console.log('load discovery document', response);
        if (response) {
          const claims: any = this.oauthService.getIdentityClaims();
          this.oauthService.loadUserProfile().then(profile => {
            console.log('identity clainms ', this.oauthService.getIdentityClaims());
          });
        }
      });
    });
  }

  public login() {
    if (this.platform.is('cordova')) {
      this.InitAppLogin();
    } else {
      this.oauthService.initLoginFlow('', {kc_idp_hint: 'facebook'});
    }
  }

  public logoff() {
      this.oauthService.logOut();
  }

  showToken() {
    console.log(this.oauthService.getAccessToken());
    this.token = this.oauthService.getAccessToken();
  }

  public get name() {
      const claims: any = this.oauthService.getIdentityClaims();
      if (!claims) { return null; }
      return claims.given_name;
  }

  doAppLogin(): Promise<any> {
    return this.oauthService.createAndSaveNonce().then(nonce => {
      let state: string = Math.floor(Math.random() * 1000000000).toString();
      let url = '';
      if (window.crypto) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        state = array.join().toString();
      }
      return new Promise((resolve, reject) => {
        const oauthUrl = this.buildUrl(state, nonce);
        console.log('oauth url', oauthUrl);
        const browser: InAppBrowserObject = this.iab.create(oauthUrl, '_blank',
          'location=no,clearsessioncache=yes,clearcache=yes,zoom=no,hideurlbar=yes');
        console.log('browser', browser);
        browser.on('loadstart').subscribe(event => {
            console.log('loadstart', event);
          });
        browser.on('loaderror').subscribe((data: InAppBrowserEvent) => {
          console.log('event', data);
          console.log('origin', window.location.origin);
          if ((data.url).indexOf(window.location.origin) === 0) {
            url = data.url;
            browser.close();
          }
          const responseParameters = ((data.url).split('#')[1]).split('&');
          console.log('response parameters', responseParameters);
          const parsedResponse: any = {};
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split('=')[0]] =
              responseParameters[i].split('=')[1];
            console.log('parsedResponse in loop', parsedResponse);
          }
          const defaultError = 'Problem authenticating with OAuth';
          if (parsedResponse.state !== state) {
            reject(defaultError);
          } else if (parsedResponse.access_token !== undefined &&
            parsedResponse.access_token !== null) {
              console.log('access token', parsedResponse.access_token);
              resolve(parsedResponse);
          } else {
            reject(defaultError);
          }
        });

        browser.on('exit').subscribe(event => {
          console.log('exit event', event);
          console.log('exit event url', url);
          reject('problem with back button..closed inapp browser with back button');
        });
      });
    });
  }

  buildUrl(state, nonce): string {
    return this.oauthService.loginUrl + '?' +
      'client_id=' + this.oauthService.clientId + '&' +
      'redirect_uri=' + this.oauthService.redirectUri + '&' +
      'response_type=id_token%20token&' +
      'scope=' + encodeURI(this.oauthService.scope) + '&' +
      'state=' + state + '&nonce=' + nonce + '&' +
      'kc_idp_hint=facebook';
  }

}
