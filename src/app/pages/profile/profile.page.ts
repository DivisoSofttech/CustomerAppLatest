import { KeycloakService } from './../../services/security/keycloak.service';
import { ContactDTO } from 'src/app/api/models';
import { CustomerDTO } from 'src/app/api/models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { GuestUserService } from 'src/app/services/security/guest-user.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { KeycloakUser } from 'src/app/models/keycloak-user';
import { LogService } from 'src/app/services/log.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  keyCloakUser: KeycloakUser;

  customer: CustomerDTO;

  contact: ContactDTO;

  @ViewChild(FooterComponent, null) footer: FooterComponent;

  constructor(
    private sharedData: SharedDataService,
    private queryResource: QueryResourceService,
    private logger: LogService,
    private keycloakService: KeycloakService,
    private alertController: AlertController,
    private guestUserService: GuestUserService,
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getKeycloakUser();
  }

  getKeycloakUser() {
    this.logger.info(this, 'Getting Keycloak User details from storage');
    this.keycloakService.getUserChangedSubscription()
      .subscribe((user: KeycloakUser) => {
        this.logger.info(this, 'Got Keycloak User details from storage', user);
        this.keyCloakUser = user;
        this.fetchCustomer();
      });
  }

  fetchCustomer() {
    this.logger.info(this, 'Fetching Customer From Server');
    this.queryResource.findCustomerByIdpCodeUsingGET(this.keyCloakUser.preferred_username)
      .subscribe(customer => {
        this.logger.info(this, 'Fetched Customer From Server' , customer);
        this.customer = customer;
        this.fetchContact();
      },
        err => {
      
          this.logger.error(this, 'Error Fetching Customer From Server');
        });
  }

  fetchContact() {
    this.logger.info(this, 'Fetching Customer Contact From Server');
    this.queryResource.findContactByIdUsingGET(this.customer.contactId)
      .subscribe(contact => {
        this.logger.info(this, 'Fetched Customer Contact From Server');
        this.contact = contact;
      },
      err=>{
        this.logger.error(this, 'Error Fetching Customer Contact From Server');
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
      buttons: [{
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
          this.cartService.emptyCart();
          this.orderService.resource = {};
          this.orderService.offer = undefined;
          this.keycloakService.logout(true);
          this.guestUserService.logInGuest();
        }
      }]
    });
    await alert.present();
  }

}
