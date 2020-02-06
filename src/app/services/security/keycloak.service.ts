import { NotificationService } from './../notification.service';
import { Util } from './../util';
import { KeycloakAdminConfig } from './../../configs/keycloak.admin.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { KeycloakAdminClient } from 'keycloak-admin/lib/client';
import { Injectable } from '@angular/core';
import { map} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LogService } from '../log.service';
import { SharedDataService } from '../shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private userChangedBehaviour: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private isGuestObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  keycloakAdmin: KeycloakAdminClient;
  customer;
  realm = 'graeshoppe';

  constructor(
    private oauthService: OAuthService,
    private keycloakConfig: KeycloakAdminConfig,
    private sharedData: SharedDataService,
    private logger: LogService,
    private util: Util,
    private notificationService: NotificationService

  ) {
    this.logger.info(this,'Created Keycloak Service');
    this.sharedData.getData('user')
    .then(storedUser => {
      if (storedUser === null ) {
        this.getCurrentUserDetails()
        .then((data: any ) => {
          this.subscribeToNotification(data);
          this.isGuestCheck(storedUser);
        });
      } else {
        this.subscribeToNotification(storedUser);
        this.isGuestCheck(storedUser);
      }
    });
  }

  subscribeToNotification(data) {
    this.getUserChangedSubscription().next(data);
    if(data) {
      if (!this.isGuest(data.preferred_username)) {
        this.logger.info(this,'Subscribing to notifications for the user from KC Cons ', data.preferred_username);
        this.notificationService.connectToNotification();
        this.notificationService.subscribeToMyNotifications(data.preferred_username);  
      }  
    }
  }

  public getUserChangedSubscription() {
    return this.userChangedBehaviour;
  }

  public getUserGuestSubscription() {
    return this.isGuestObservable;
  }

  createAccount(user: any, password: string, success: any, err: any) {
    this.logger.info(this,'Keycloak Service Create Account');
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      user.realm = this.realm;
      user.credentials = [{ type: 'password', value: password }];
      user.attributes = map;
      user.enabled = true;
      this.keycloakAdmin.users
        .create(user)
        .then(async res => {
          this.logger.info(this,'User Created With id Sub:' , res);
          this.logger.info(this,'Fetching Availabel Roles');
          await this.keycloakAdmin.users.addRealmRoleMappings({
                id: res.id,
                realm: this.realm,
                roles: [
                  {
                    id: 'd2745301-d632-446e-a941-de016048a0f0',
                    name: 'customer'
                  }
                ]
              }).then(() => success(res));
          this.logger.info(this,'User Creation Successfull');
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
    this.logger.info(this,'Checking User Role ', user);
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
              this.logger.info(this,'Available Roles For The User Are ', roles);
              const rolesAvailable = await roles.realmMappings.filter(
                mapping => {
                  if (mapping.name === 'customer') {
                    return true;
                  }
                }
              );
              this.logger.info(this,'Roles Availabel Length is ', rolesAvailable.length);
              if (rolesAvailable.length === 1) {
                resolve(true);
              } else {
                this.logger.info(this,'Its false');
                resolve(false);
              }
            });
        })
        .catch(err => reject(false));
    });
  }

  async isUserLoggedIn() {
    return this.isAuthenticated()
    .then((isAuthenticated) => {
      if(isAuthenticated) {
        return this.getCurrentUserDetails()
        .then((data:any) => {
          if(data.preferred_username !== 'guest') {
            return true;
          } else {
            return false;
          }
        })
      }
    })
    .catch(() => {
      return false;
    });
  }


  async authenticateUser(credentials: any, success: any) {
    this.logger.info(this,'Authenticating User')
    await this.oauthService
    .fetchTokenUsingPasswordFlowAndLoadUserProfile(
      credentials.username,
      credentials.password,
      new HttpHeaders()
    )
    .then(data => {
      this.logger.info(this,'Data after authenticate ', data);
      this.sharedData.saveToStorage('user' , data);
      this.userChangedBehaviour.next(data);
      this.isGuestCheck(data);
      this.customer = data;
      success();
    });
  }


  async authenticateAndAuthorize(credentials: any, success: any, failure: any, err: any) {
    this.logger.info(this,'Authenticating user' , credentials);
    await this.oauthService
      .fetchTokenUsingPasswordFlowAndLoadUserProfile(
        credentials.username,
        credentials.password,
        new HttpHeaders()
      )
      .then(data => {
        this.logger.info(this,'Data after authenticate ', data);
        this.sharedData.saveToStorage('user', data);
        this.userChangedBehaviour.next(data);
        this.isGuestCheck(data);
        this.customer = data;
        success();
        if(!this.isGuest(credentials.username)) {
          this.notificationService.connectToNotification();
          this.notificationService.subscribeToMyNotifications(credentials.username);  
        }
        // this.checkUserInRole(this.customer.sub)
        //   .then(hasRoleCustomer => {
        //     if (hasRoleCustomer) {
        //       this.logger.info(this,'Success callback');
        //       success();
        //       if (!this.isGuest(credentials.username)) {
        //          console.log('IsNotGuest');
        //          this.notificationService.connectToNotification();
        //          this.notificationService.subscribeToMyNotifications(credentials.username);
        //       }
        //     } else {
        //       this.oauthService.logOut();
        //       this.logger.info(this,'Failure callback');
        //       failure();
        //     }
        //   })
        //   .catch(error => {
        //     failure();
        //     this.logger.error(this,'Error in authentication', error);
        //     });
      })
      .catch(err=> {
        failure();
      });
  }

  // Kept For Compatability if any components are using this
  isGuest(user): boolean {
    this.logger.info(this,'Checking if The Current User is Guest');
    if (user === 'guest') {
      return true;
    }
    return false;
  }

  isGuestCheck(user) {
    this.logger.info(this,'Checking if The Current User is Guest');
    if(user) {
      if (user.preferred_username === 'guest') {
        this.isGuestObservable.next(true);
      } else {
        this.isGuestObservable.next(false);
      }  
    } else {
      this.isGuestObservable.next(true);
    }
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
    this.sharedData.getData('user').then(user => {
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
        this.logger.info(this,'User', user);
      });
    });
  }

  ForgetPassword(user, newPassword, success, err) {
    this.logger.info(this,'ForgotPassword User:', user);
    this.keycloakConfig.refreshClient().then(() => {
      this.keycloakAdmin = this.keycloakConfig.kcAdminClient;
      this.keycloakAdmin.users
        .resetPassword({
          realm: 'graeshoppe',
          id: user.idpSub,
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

  logout(navigateBack) {
    this.oauthService.logOut();
    this.sharedData.clearKeys('order','cart','user','customer','contact','address');
    this.userChangedBehaviour.next(null);
    this.isGuestObservable.next(null);
    if(navigateBack) {
      this.util.navigateHome();
    }
    this.notificationService.disconnectToMyNotifications();
  }
}
