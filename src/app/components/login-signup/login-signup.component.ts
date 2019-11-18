import { NGXLogger } from 'ngx-logger';
import { KeycloakService } from './../../services/security/keycloak.service';
import { IonSlides, MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { CommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { ApiConfiguration } from 'src/app/api/api-configuration';
import { Storage } from '@ionic/storage';
import { PhoneNumberVerficationComponent } from '../phone-number-verfication/phone-number-verfication.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  username = '';
  password = '';
  email = '';
  phone = 0;
  numberValid = false;
  numberCode = 0;
  loginTab = true;
  value = 'login';
  keycloakUserid;

  showPasswordText = false;
  passwordFieldType = 'password';

  @ViewChild('slides', null) slides: IonSlides;

  @Input() type = 'page';

  constructor(
    private keycloakService: KeycloakService,
    private queryResourceService: QueryResourceService,
    private commandResourceService: CommandResourceService,
    private util: Util,
    private modalController: ModalController,
    private logger: NGXLogger,
    private apiConfiguration: ApiConfiguration,
    private storage: Storage
  ) {}

  ngOnInit() {
  }

  // Login and Register Methods

  login() {
    this.logger.info('LoginCalled++++++++++++++++++++');
    this.util.createLoader()
      .then(loader => {
        loader.present();
        this.keycloakService.authenticateAndAuthorize({ username: this.username, password: this.password },
          () => {
            loader.dismiss();
            this.logger.info('Logged in+++++++');
            this.util.createToast('Logged in successfully', 'checkmark-circle-outline');
            this.createUserIfNotExists(this.username);
          }, () => {
            loader.dismiss();
            this.util.createToast('You are not authorized / Please signup');
          },
          () => {
            loader.dismiss();
            this.util.createToast('Invalid Username / Password');
          });
      });
  }

  async signupModal() {

    const modal = await this.modalController.create({
      component: PhoneNumberVerficationComponent,
      componentProps: {number: this.numberCode + this.phone},
      cssClass: 'full-height'
    });

    modal.onDidDismiss()
    .then((data: any) => {
      this.logger.info('onDismissCalled+++++++');
      console.log('---------' , data.data.numberVerified);
      if (data.data.numberVerified === true) {
          this.signup();
        }
    });

    modal.present();
  }

  async forgetPasswordModal() {
    const modal = await this.modalController.create({
      component: ForgetPasswordComponent
    });
    modal.present();
  }

  showPassword(val) {
    this.passwordFieldType = val ? 'text' : 'password';
    this.showPasswordText = val;
  }

  signup() {
    this.logger.info('signup+++++++');
    this.util.createCustomLoader('lines', 'Logging in')
      .then(loader => {
        loader.present();
        const user = { username: this.username, email: this.email };
        this.keycloakService.createAccount(user, this.password,
          (res) => {
            this.logger.info('keycloakService.createAccount+++++++');
            loader.dismiss();
            this.keycloakUserid = res.id;
            this.keycloakService.authenticateUser({ username: this.username, password: this.password }
              , () => {
                this.logger.info('Success callack navgating to route');
                this.dismissTrue();
                this.util.navigateHome();
              });
            this.createUserIfNotExists(this.username);
          },
          (err) => {
            loader.dismiss();
            if (err.response.status === 409) {
              this.util.createToast('User Already Exists');
              this.slideChange();
            } else {
              this.util.createToast('Cannot Register User. Please Try Later');
            }
          });
          // Remove this later
        });
  }

  isLoggedIn() {
    this.keycloakService
      .isAuthenticated()
      .then(() => {
        this.util.navigateRoot();
      })
      .catch(() => {
        this.logger.info('Not Logged In');
      });
  }

  createUserIfNotExists(reference) {
      this.logger.info('Checking if User Exists in MicroService Else Create');
      this.queryResourceService
        .checkUserExistsUsingGET(reference)
        .subscribe(
          isUserExists => {
            this.logger.info('IsUserExists ', isUserExists);
            if (isUserExists) {
              this.queryResourceService.findCustomerByReferenceUsingGET(reference)
            .subscribe(customer => {
              this.logger.info('Got Customer', customer);
              this.storage.set('customer' , customer);
              this.keycloakService.getCurrentUserDetails()
            .then(data => {
              this.keycloakService.getUserChangedSubscription().next(data);
            });
        });
      } else {
        this.logger.info('User is not exists creating new user');
        this.commandResourceService
                .createCustomerUsingPOST({
                  reference: this.username,
                  name: this.username,
                  email: this.email,
                  mobileNumber: this.phone,
                  phoneCode: this.numberCode,
                  searchKey: this.keycloakUserid
                })
                .subscribe(
                  customer => {
                    this.logger.info('Customer Created', customer);
                    this.storage.set('customer' , customer);
                  },
                  error => {
                    this.logger.info(error);
                    this.util.createToast('Server is Unreachable');
                  }
                );
      }
  },
          err => {
          }
        );
  }

  // View Related Methods

  loginDisabled(): boolean {
    if (this.username === '' || this.password === '') {
      return true;
    } else {
      return false;
    }
  }

  registerDisabled(): boolean {
    if (this.username === '' || this.password === '' || this.email === '' || this.numberValid === false) {
      return true;
    } else {
      return false;
    }
  }

  slide(value) {
    this.value = value.detail.value;
    if (this.value === 'login') {
      this.slides.slideTo(0);
    } else {
      this.slides.slideTo(1);
    }
  }

  slideChange() {
    let currentSlide;
    this.slides.getActiveIndex().then(num => {
      currentSlide = num;
      if (this.value === 'login' && currentSlide !== 0) {
        this.value = 'signup';
      } else if (this.value === 'signup' && currentSlide !== 1) {
        this.value = 'login';
      }
    });
  }

  checkNumber(event) {
    console.log('Event', event);
    this.numberValid = event.valid;
    this.numberCode = event.extra.numberCode;
    this.phone = event.value.slice(event.extra.numberCode.toString().length , event.value.length);
  }

  setSlideValue(): number {
    this.slideChange();
    return 1;
  }

  navigateRoot() {
    this.util.navigateHome();
  }

  dismissTrue() {
    this.modalController.dismiss(true);
  }

  dismiss() {
    this.modalController.dismiss(false);
  }
}

