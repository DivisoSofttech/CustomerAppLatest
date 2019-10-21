import { NotificationService } from './../notification.service';
import { NGXLogger } from 'ngx-logger';
import { Util } from './../util';
import { KeycloakAdminConfig } from './../../configs/keycloak.admin.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { KeycloakAdminClient } from 'keycloak-admin/lib/client';
import { Injectable } from '@angular/core';
import { map, first } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private userChangedBehaviour: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  keycloakAdmin: KeycloakAdminClient;
  customer;
  realm = 'graeshoppe';
  constructor(
    private oauthService: OAuthService,
    private keycloakConfig: KeycloakAdminConfig,
    private storage: Storage,
    private logger: NGXLogger,
    private util: Util,
    private notificationService: NotificationService

  ) {
    this.logger.info('Created Keycloak Service');
    this.getCurrentUserDetails()
    .then((data: any ) => {
      this.getUserChangedSubscription().next(data);
      if (!this.isGuest(data.preferred_username)) {
        console.log('Subscribing to notifications for the user from KC Cons ', data.preferred_username);
        this.notificationService.connectToNotification();
        this.notificationService.subscribeToMyNotifications(data.preferred_username);
      }
    });
  }

  public getUserChangedSubscription() {
    return this.userChangedBehaviour;
  }

  createAccount(user: any, password: string, success: any, err: any) {
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      user.realm = this.realm;
      user.credentials = [{ type: 'password', value: password }];
      user.attributes = map;
      user.enabled = true;
      this.keycloakAdmin.users
        .create(user)
        .then(async res => {
          this.logger.info('Create use id sub is ', res);
          await this.keycloakAdmin.roles
            .findOneByName({
              name: 'customer',
              realm: this.realm
            })
            .then(async role => {
              this.logger.info('Role findonebyname ', role);
              await this.keycloakAdmin.users.addRealmRoleMappings({
                id: res.id,
                realm: this.realm,
                roles: [
                  {
                    id: role.id,
                    name: role.name
                  }
                ]
              });
            });
          success(res);
        })
        .catch(e => {
          err(e);
        });
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.oauthService.hasValidAccessToken();
  }
  async checkUserInRole(user): Promise<boolean> {
    this.logger.info('Checking user in role ', user);
    return await new Promise<boolean>(async (resolve, reject) => {
      await this.keycloakConfig
        .refreshClient()
        .then(async () => {
          await this.keycloakConfig.kcAdminClient.users
            .listRoleMappings({
              id: user,
              realm: this.realm
            })
            .then(async roles => {
              this.logger.info('Available roles for the user are ', roles);
              const rolesAvailable = await roles.realmMappings.filter(
                mapping => {
                  if (mapping.name === 'customer') {
                    return true;
                  }
                }
              );
              this.logger.info('Length is ', rolesAvailable.length);
              if (rolesAvailable.length === 1) {
                resolve(true);
              } else {
                this.logger.info('Its false');
                resolve(false);
              }
            });
        })
        .catch(err => reject(false));
    });
  }

  async authenticate(credentials: any, success: any, failure: any, err: any) {
    await this.oauthService
      .fetchTokenUsingPasswordFlowAndLoadUserProfile(
        credentials.username,
        credentials.password,
        new HttpHeaders()
      )
      .then(data => {
        this.logger.info('Data after authenticate ', data);
        this.storage.set('user', data);
        this.userChangedBehaviour.next(data);
        this.customer = data;
        this.checkUserInRole(this.customer.sub)
          .then(hasRoleCustomer => {
            if (hasRoleCustomer) {
              this.logger.info('Success callback');
              success();
              if (!this.isGuest(credentials.username)) {
                 console.log('IsNotGuest');
                 this.notificationService.connectToNotification();
                 this.notificationService.subscribeToMyNotifications(credentials.username);
              }
            } else {
              this.oauthService.logOut();
              this.logger.info('Failure callback');
              failure();
            }
          })
          .catch(error => {
            failure();
            console.log('Error in authenticate', error);
            });
      });
  }

  isGuest(user): boolean {
    console.log('Checking is guest');
    if (user === 'guest') {
      return true;
    }
    return false;
  }
  async getCurrentUserDetails() {
    if (this.oauthService.hasValidAccessToken()) {
      return await this.oauthService.loadUserProfile();
    } else {
      return;
    }
  }

  async updateCurrentUserDetails(
    keycloakUser: any,
    success,
    err
  ): Promise<void> {
    const lastN = keycloakUser.name.split(' ')[1];
    const firstN = keycloakUser.name.split(' ')[0];

    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users
        .update(
          {
            id: keycloakUser.sub,
            realm: this.realm
          },
          {
            firstName: firstN,
            lastName: lastN !== undefined ? lastN : null,
            email: keycloakUser.email
          }
        )
        .then(() => {
          success();
        })
        .catch(() => {
          err();
        });
    });
  }

  resetPassword(newPassword, success, err) {
    this.storage.get('user').then(user => {
      this.keycloakConfig.refreshClient().then(() => {
        this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
        this.keycloakAdmin.users
          .resetPassword({
            realm: this.realm,
            id: user.sub,
            credential: {
              temporary: false,
              type: 'password',
              value: newPassword
            }
          })
          .then(data => {
            success(data);
          })
          .catch(e => {
            err(e);
          });
      });
    });
  }

  getUser(userId) {
    console.log('entered');
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users.findOne({id: userId}).then(user => {
        console.log('user', userId);
        console.log('userA', user);
      });
    });
  }

  ForgetPassword(user, newPassword, success, err) {
    console.log('user', user);
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users
        .resetPassword({
          realm: 'graeshoppe',
          id: user.searchKey,
          credential: {
            temporary: false,
            type: 'password',
            value: newPassword
          }
        })
        .then(data => {
          success(data);
        })
        .catch(e => {
          err(e);
        });
    });
  }

  logout() {
    this.oauthService.logOut();
    this.storage.clear();
    this.userChangedBehaviour.next(null);
    this.util.navigateHome();
    this.notificationService.disconnectToMyNotifications();
  }
}
