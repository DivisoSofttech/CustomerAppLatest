import { KeycloakService } from './../../services/security/keycloak.service';
import { IonSlides, MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { CommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { ApiConfiguration } from 'src/app/api/api-configuration';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  username = '';
  password = '';
  email = '';
  loginTab = true;
  value = 'login';
  phone: number;
  @ViewChild('slides', null) slides: IonSlides;

  constructor(
    private keycloakService: KeycloakService,
    private queryResourceService: QueryResourceService,
    private commandResourceService: CommandResourceService,
    private util: Util,
    private apiConfiguration: ApiConfiguration,
    private storage: Storage,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    // this.isLoggedIn();
  }

  // Login and Register Methods

  login() {
    this.util.createLoader()
      .then(loader => {
        loader.present();
        this.keycloakService.authenticate({ username: this.username, password: this.password },
          () => {
            loader.dismiss();
            this.util.createToast('Logged in successfully');
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

  signup() {
    this.util.createLoader()
      .then(loader => {
        loader.present();
        const user = { username: this.username, email: this.email };
        this.keycloakService.createAccount(user, this.password,
          (res) => {
            loader.dismiss();
            this.login();
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
        console.log('Not Logged In');
      });
  }

  createUserIfNotExists(reference) {
    this.util.createLoader().then(loader => {
      loader.present();
      console.log('Checking if User Exists in MicroService Else Create');
      this.queryResourceService
        .findCustomerByReferenceUsingGET(reference)
        .subscribe(
          customer => {
            console.log('Got Customer', customer);
            this.storage.set('customer' , customer);
            loader.dismiss();
            this.dismissTrue();
          },
          err => {
            if (err.status === 500) {
              // Check if server is reachable
              const url = this.apiConfiguration.rootUrl.slice(
                2,
                this.apiConfiguration.rootUrl.length
              );
              this.commandResourceService
                .createCustomerUsingPOST({
                  reference: this.username,
                  name: this.username,
                  email: this.email
                })
                .subscribe(
                  customer => {
                    console.log('Customer Created', customer);
                    this.storage.set('customer' , customer);
                    loader.dismiss();
                    this.dismissTrue();
                  },
                  eror => {
                    console.log(eror);
                    loader.dismiss();
                    this.util.createToast('Server is Unreachable');
                  }
                );
            } else {
              loader.dismiss();
            }
          }
        );
    });
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
    if (this.username === '' || this.password === '' || this.email === '') {
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

