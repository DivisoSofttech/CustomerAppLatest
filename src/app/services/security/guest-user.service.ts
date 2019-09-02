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
  ) { }

  private credentials = {
    username: 'guest',
    password: 'guest'
  };

  async logInGuest() {
    await this.keycloakService.authenticate(this.credentials,
      (success) => {
        console.log('guest-logged-in');
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
          console.log('guest-logged-out');
        }
      }
    );
  }
}
