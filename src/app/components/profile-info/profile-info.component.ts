import { ProfileEditComponent } from './../profile-edit/profile-edit.component';
import { ModalController } from '@ionic/angular';
import { CustomerDTO } from 'src/app/api/models';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {

  @Input() customer: CustomerDTO;

  @Input() keyCloakUser;

  @Input() contact;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async presentEditProfileComponent() {

    const modal = await this.modalController.create({
      component: ProfileEditComponent,
      componentProps: {  profileKeycloak: this.keyCloakUser , customer: this.customer,
        contact: this.contact
      }
    });

    modal.onDidDismiss()
      .then((data: any) => {
        try {
          console.log(data);
          this.customer = data.data.customer;
          this.keyCloakUser = data.data.keyCloakUser;
          this.contact = data.data.contact;
        } catch (error) {

        }
      });

    modal.present();
  }

}
