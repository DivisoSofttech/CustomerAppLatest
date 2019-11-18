import { NavController } from '@ionic/angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Storage } from '@ionic/storage';
import { GuestUserService } from './guest-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  customer;
  role;
  hasAccess: boolean;
  
  constructor(
    private oauthService: OAuthService,
    private navController: NavController,
    private storage: Storage,
    private guestUserService: GuestUserService
  ) {}

  /**
   * This function is called When the app route changes
   * @param route 
   * @param state 
   * 
   */
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      await this.storage.get('user').then(async user => {
        if (user) {
          /**
           * Check if user is guest and current url is /profile
           * if url is profile logout guest and route to login page
           */
          if (user.preferred_username === 'guest' && state.url === '/profile') {
            await this.guestUserService.logOutGuest();
            reject(this.onReject());
          } else  {

            /**
             * Else if user is not guest check if there is valid access token
             */
            await this.hasValidToken(state.url).then(bool => {
              resolve(true);
            }).catch(bool => {
              reject(this.onReject());
            });
          }
        } else {
          /**
           * Else if there is no valid key user in storage 
           * Login guest
           */
          await this.guestUserService.logInGuest();
          resolve(true);  
        }
      });
    });
  }


  /**
   * 
   * Check if there is valid access token
   * else navigate to login page
   * @param routeUrl 
   * 
   */
  async hasValidToken(routeUrl: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (this.oauthService.hasValidAccessToken()) {
        resolve(true);
      } else if (routeUrl === '/profile') {
        this.navController.navigateRoot('/login');
        reject(false);
      }
    });
  }

  /**
   * Navigate back to Login Page
   */
  onReject(): boolean {
    this.navController.navigateRoot('/login');
    return false;
  }
}
