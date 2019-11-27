import { KeycloakService } from './../../services/security/keycloak.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { KeycloakAdminClient } from 'keycloak-admin/lib/client';
import { CustomerDTO, ContactDTO } from 'src/app/api/models';
import {
  QueryResourceService,
  CommandResourceService
} from 'src/app/api/services';
import { ImageSelectorComponent } from '../image-selector/image-selector.component';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileKeycloak;
  customer: CustomerDTO = {};
  contact: ContactDTO;
  mobileNumber;

  defaultImage: string;

  loadingElement: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger,
    private commandResourceService: CommandResourceService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit() {
    this.logger.info('KeyCloak ', this.profileKeycloak);
    this.logger.info('Customer ', this.customer);
    this.logger.info('Contact ', this.contact);
  }

  nonSaveDismiss() {
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      customer: this.customer,
      keyCloakUser: this.profileKeycloak,
      contact: this.contact
    });
  }

  removeImage() {
    this.customer.image = null;
    this.customer.imageContentType = null;
  }

  async selectImage() {
    const modal = await this.modalController.create({
      component: ImageSelectorComponent,
      cssClass: 'half-height'
    });

    modal.onDidDismiss().then(data => {
      this.customer.image = data.data.image.substring(
        data.data.image.indexOf(',') + 1
      );
      this.customer.imageContentType = data.data.image.slice(
        data.data.image.indexOf(':') + 1,
        data.data.image.indexOf(';')
      );
    });

    return await modal.present();
  }

  update() {
    this.profileKeycloak.name = this.customer.name;
    this.logger.info(
      'Saving User Details',
      this.profileKeycloak,
      this.customer,
      this.contact
    );
    this.keycloak.updateCurrentUserDetails(
      this.profileKeycloak,
      () => {
        this.commandResourceService
          .updateCustomerUsingPUT(this.customer)
          .subscribe(c => {
            this.customer = c;
            if (this.contact !== undefined) {
              this.commandResourceService
                .updateContactUsingPUT(this.contact)
                .subscribe(contact => {
                  this.contact = contact;
                  this.dismiss();
                });
            }
          });
      },
      () => {}
    );
  }
}
