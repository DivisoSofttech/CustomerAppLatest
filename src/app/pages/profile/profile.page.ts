import { KeycloakService } from './../../services/security/keycloak.service';
import { ContactDTO } from 'src/app/api/models';
import { CustomerDTO } from 'src/app/api/models';
import { Storage } from '@ionic/storage';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides , null) ionSlides: IonSlides;

  currentSegment = 'frequently';

  customer: CustomerDTO;

  keyCloakUser;

  contact: ContactDTO;

  @ViewChild(FooterComponent , null) footer: FooterComponent;


  constructor(
    private storage: Storage,
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private keycloak: KeycloakService
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  segmentChanged(event) {
    if (event.detail.value === 'frequently') {
      this.ionSlides.slideTo(0);
    } else if (event.detail.value === 'favourite') {
      this.ionSlides.slideTo(1);
    } else {
      this.ionSlides.slideTo(2);
    }
  }

  slideChanged(event) {
    let index: any;
    this.ionSlides.getActiveIndex().then(num => {
      index = num;
      if (index === 0) {
        this.currentSegment = 'frequently';
      } else if (index === 1) {
        this.currentSegment = 'favourite';
      } else {
        this.currentSegment = 'history';
      }
    });
  }

  getUserProfile() {
    this.storage.get('user')
    .then(user => {
      this.keyCloakUser = user;
      this.queryResource.findCustomerByReferenceUsingGET(user.preferred_username)
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

  logout() {
    this.keycloak.logout();
  }

}
