import { KeycloakService } from './keycloak.service';
import { NavController } from '@ionic/angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  customer;
  role;
  hasAccess: boolean;
  constructor(private oauthService: OAuthService,
              private router: Router,
              private navController: NavController,
              private keycloakService: KeycloakService
             ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.oauthService.hasValidAccessToken()) {
     return true;
   }
    this.navController.navigateRoot('/login');
    return false;
   }
}
