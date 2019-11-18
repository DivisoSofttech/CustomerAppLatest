import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';
import { KeycloakService } from './keycloak.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  constructor(
    private keycloakService: KeycloakService,
    private storage: Storage,
    private logger: NGXLogger,
  ) { }

  private credentials = {
    username: 'guest',
    password: 'guest'
  };

  async logInGuest() {
    await this.keycloakService.authenticate(this.credentials,
      (success) => {
        this.logger.info('guest-logged-in');
        this.keycloakService.getCurrentUserDetails()
        .then(data => {
          this.keycloakService.getUserChangedSubscription().next(data);
        });
    }, (failure) => {
    }, (err) => {

    });
  }

  async logOutGuest() {
    await this.storage.get('user').then(
      async user => {
        if (user && user.preferred_username === 'guest') {
          await this.keycloakService.logout();
          await this.storage.remove('user');
          this.logger.info('guest-logged-out');
        }
      }
    );
  }
}
