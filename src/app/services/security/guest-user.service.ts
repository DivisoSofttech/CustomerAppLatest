import { Storage } from '@ionic/storage';
import { KeycloakService } from './keycloak.service';
import { Injectable } from '@angular/core';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  constructor(
    private keycloakService: KeycloakService,
    private storage: Storage,
    private logger: LogService,
  ) { }

  private credentials = {
    username: 'guest',
    password: 'guest'
  };

  async logInGuest() {
    await this.keycloakService.authenticateAndAuthorize(this.credentials,
      (success) => {
        this.logger.info(this, 'guest-logged-in');
        this.keycloakService.getCurrentUserDetails()
          .then(data => {
            this.keycloakService.getUserChangedSubscription().next(data);
          });
      }, (failure) => {
        this.logger.error(this, 'Error in Guest Login')
      }, (err) => {
        this.logger.error(this, 'Error in Guest Login')
      });
  }

  async logOutGuest() {
    await this.storage.get('user').then(
      async user => {
        if (user && user.preferred_username === 'guest') {
          await this.keycloakService.logout(false);
          await this.storage.remove('user');
          this.logger.info(this,'guest-logged-out');
        }
      }
    );
  }
}
