import { Util } from './../util';
import { KeycloakAdminConfig } from './../../configs/keycloak.admin.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { KeycloakAdminClient } from 'keycloak-admin/lib/client';
import { Injectable } from '@angular/core';
import { map, first } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  keycloakAdmin: KeycloakAdminClient;
  customer;
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
   async checkUserInRole(user): Promise<boolean> {
    console.log('Checking user in role ', user);
    return await new Promise<boolean>(async (resolve, reject) => {
      await this.keycloakConfig.refreshClient().then(async () => {
        await this.keycloakConfig.kcAdminClient.users.listRoleMappings({
          id: user,
          realm: 'graeshoppe'
        }).then(async (roles) =>  {
          console.log('Available roles for the user are ', roles);
          const rolesAvailable = await roles.realmMappings.filter( mapping => {
            if (mapping.name === 'customer') {
              return true;
            }
          });
          console.log('Length is ', rolesAvailable.length);
          if (rolesAvailable.length === 1) {
              resolve(true);
            } else {
              console.log('Its false');
              resolve(false);
            }
        });
      }).catch(err => reject(false) );
    });
  }

  authenticate(credentials: any, success: any, failure: any, err: any) {
    this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
      credentials.username,
      credentials.password,
      new HttpHeaders()
    ).then(data => {
      console.log('Data after authenticate ', data);
      this.storage.set('user' , data);
      this.customer = data;
      this.checkUserInRole(this.customer.sub).then(hasRoleCustomer => {
        if (hasRoleCustomer) {
          console.log('Success callback');
          success();
        } else {
          this.oauthService.logOut();
          console.log('Failure callback');
          failure();
        }
      }).catch(() => failure());
    });
  }

  async getCurrentUserDetails() {
    return await this.oauthService.loadUserProfile();
  }

  async updateCurrentUserDetails(keycloakUser: any , success, err): Promise<void> {

    const lastN = keycloakUser.name.split(' ')[1];
    const firstN = keycloakUser.name.split(' ')[0];

    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users.update(
        {
          id: keycloakUser.sub,
          realm: 'graeshoppe'
        },
        {
          firstName: firstN,
          lastName: lastN !== undefined ? lastN : null,
          email: keycloakUser.email
        }
      ).then(() => {
        success();
      })
      .catch(() => {
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
        });
      });

    });
  }

  logout() {
    this.oauthService.logOut();
    this.storage.clear();
    this.util.navigateToLogin();
  }
}
