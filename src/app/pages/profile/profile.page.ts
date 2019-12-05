import { KeycloakService } from './../../services/security/keycloak.service';
import { ContactDTO } from 'src/app/api/models';
import { CustomerDTO } from 'src/app/api/models';
import { Storage } from '@ionic/storage';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { GuestUserService } from 'src/app/services/security/guest-user.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides , null) ionSlides: IonSlides;

  // Change this to frequently
  currentSegment = 'favourite';

  customer: CustomerDTO;

  keyCloakUser;

  contact: ContactDTO;

  slideOpts = {
    slidesPerView: 2,
    watchSlidesProgress: true,
    spaceBetween: 0,    
  };

  @ViewChild(FooterComponent , null) footer: FooterComponent;

  @ViewChild(IonSlides , null) slides;
  slidesMoving: boolean;
  slidesHeight: number;


  constructor(
    private storage: Storage,
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private keycloak: KeycloakService,
    private alertController: AlertController,
    private guestUserService: GuestUserService,
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  segmentChanged(event) {
    if (event.detail.value === 'frequently') {
      // this.ionSlides.slideTo(9);
    } else if (event.detail.value === 'favourite') {
      this.ionSlides.slideTo(0);
    } else {
      this.ionSlides.slideTo(1);
    }
  }

  slideChanged(event) {
    let index: any;
    this.ionSlides.getActiveIndex().then(num => {
      index = num;
      // Change this to 0
      // Temp Fix Since Frequently Page is
      if (index === 99) {
        this.currentSegment = 'frequently';
      } else if (index === 0) {
        this.currentSegment = 'favourite';
      } else {
        this.currentSegment = 'history';
      }
    });
  }
  slideWillChange () {
    this.slidesMoving = true;
  }

  getUserProfile() {
    this.storage.get('user')
    .then(user => {
      this.keyCloakUser = user;
      this.queryResource.findCustomerByIdpCodeUsingGET(user.preferred_username)
      .subscribe(customer => {
        this.customer = customer;
        this.queryResource.findContactByIdUsingGET(this.customer.contactId)
        .subscribe(contact => {
          this.contact = contact;
        });
      });
    });
  }

  // Fix for Footer Button Change
  ionViewDidEnter() {
    this.logger.info('Ion View Did enter');
    this.footer.setcurrentRoute('profile');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout ',
      buttons: [ {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.logger.info('Confirm Cancel: blah');
          this.alertController.dismiss();
        }
      }, {
        text: 'Okay',
        handler: () => {
          this.keycloak.logout();
        }
      }]
    });
    this.cartService.emptyCart();
    this.orderService.resource = {};
    this.orderService.offer = undefined;
    this.guestUserService.logInGuest();
    await alert.present();
  }

}
