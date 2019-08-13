import { Util } from './../util';
import { KeycloakAdminConfig } from './../../configs/keycloak.admin.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { KeycloakAdminClient } from 'keycloak-admin/lib/client';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  keycloakAdmin: KeycloakAdminClient;

  constructor(
    private oauthService: OAuthService,
    private keycloakConfig: KeycloakAdminConfig,
    private storage: Storage,
    private util: Util
  ) {


  }


  createAccount(user: any, password: string, success: any, err: any) {
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      user.realm = 'graeshoppe';
      user.credentials = [{ type: 'password', value: password }];
      user.attributes = map;
      user.enabled = true;

      this.keycloakAdmin.users.create(user)
        .then(res => {
          success(res);
        })
        .catch(e => {
          err(e);
        });
    }
    );

  }

  async isAuthenticated(): Promise<boolean> {
    return await this.oauthService.hasValidAccessToken();
  }

  authenticate(credentials: any, success: any, err: any) {
    this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
      credentials.username,
      credentials.password,
      new HttpHeaders()
    ).then(data => {
      this.storage.set('user' , data);
      success();
    }).catch(e => {
      err();
    });
  }

  async getCurrentUserDetails() {
    return await this.oauthService.loadUserProfile();
  }

  async updateCurrentUserDetails(keycloakUser: any , success,err): Promise<void> {
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users.update(
        {
          id: keycloakUser.sub,
          realm: 'graeshoppe'
        },
        {
          firstName: keycloakUser.name.split(' ')[0],
          lastName: keycloakUser.name.split(' ')[1],
          email: keycloakUser.email
        }
      ).then(()=> {
        success();
      })
      .catch(()=>{
        err();
      });
    });

  }

  resetPassword(newPassword , success , err) {
    this.storage.get('user')
    .then(user => {
      this.keycloakConfig.refreshClient()
      .then(() => {
        this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
        this.keycloakAdmin.users.resetPassword(
          {
            realm: 'graeshoppe',
            id: user.sub,
            credential: {
              temporary: false,
              type: 'password',
              value: newPassword,
            },
          }
        ).then(data => {
          success(data);
        })
        .catch(e => {
          err(e);
        })
      });
  
    })
  }

  logout() {
    this.oauthService.logOut();
    this.storage.clear();
    this.util.navigateToLogin();
  }
}
