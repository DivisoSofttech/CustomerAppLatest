import { KeycloakService } from './keycloak.service';
import { NavController } from '@ionic/angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
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
    private router: Router,
    private navController: NavController,
    private keycloakService: KeycloakService,
    private storage: Storage,
    private guestUserService: GuestUserService
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      await this.storage.get('user').then(async user => {
        if (user) {
          if (user.preferred_username === 'guest' && state.url === '/profile') {
            await this.guestUserService.logOutGuest();
            reject(this.onReject());
          } else  {
            await this.hasValidToken(state.url).then(bool => {
              resolve(true);
            }).catch(bool => {
              reject(this.onReject());
            });
          }
        } else {
          await this.hasValidToken(state.url).then(bool => {
            resolve(true);
          }).catch(bool => {
            reject(this.onReject());
          });
        }
      });
    });
  }

  async hasValidToken(routeUrl: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (this.oauthService.hasValidAccessToken()) {
        resolve(true);
      } else if (routeUrl === '/profile') {
        this.navController.navigateRoot('/login');
        reject(false);
      } else {
        await this.guestUserService.logInGuest();
        resolve(true);
      }
    });
  }

  onReject(): boolean {
    this.navController.navigateRoot('/login');
    return false;
  }
}
