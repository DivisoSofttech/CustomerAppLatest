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
    private queryResourceService: QueryResourceService,
    private commandResourceService: CommandResourceService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit() {

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
    this.customer.photo = null;
    this.customer.photoContentType = null;
  }

  async selectImage() {
    const modal = await this.modalController.create({
      component: ImageSelectorComponent,
      cssClass: 'half-height'
    });

    modal.onDidDismiss().then(data => {
      this.customer.photo = data.data.imageBase64;
      this.customer.photoContentType = data.data.imageType;
    });

    return await modal.present();
  }

  update() {
    this.keycloak.updateCurrentUserDetails(this.profileKeycloak,() => {
      this.commandResourceService.updateCustomerUsingPUT(this.customer)
      .subscribe(c => {
        this.customer = c;
        if(this.contact !== undefined) {
          this.commandResourceService.updateContactUsingPUT(this.contact)
          .subscribe(contact => {
            this.contact = contact;
            this.dismiss();
          });
        }
      });
    },
    () => { });
  }
}
