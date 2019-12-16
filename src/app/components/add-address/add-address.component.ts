import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LogService } from 'src/app/services/log.service';
import { ContactDTO } from 'src/app/api/models';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {

  @Input() address: any = {};

  @Input() mode = 'create';

  addressForm: FormGroup;

  user;

  contact: ContactDTO;

  constructor(
    private modalController: ModalController,
    private commandResourceService: CommandResourceService,
    private formBuilder: FormBuilder,
    private utilService: Util,
    private logger: LogService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.getUser();
    this.createAddressForm();
  }

  getContact() {
    this.sharedDataService.getData('contact')
    .then(contact => {
      if(contact) {
        this.contact = contact;
        this.addressForm.patchValue({'email': this.contact.email});
        this.addressForm.patchValue({'phone':this.contact.mobileNumber})
        this.addressForm.patchValue({'name':this.user.preferred_username})
      }
    })
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      name: [this.address.name, Validators.compose([Validators.required])],
      phone: [this.address.phone, Validators.compose([Validators.required])],
      pincode: [this.address.pincode],
      houseNoOrBuildingName: [this.address.houseNoOrBuildingName, Validators.compose([Validators.required])],

      addressType: [this.address.addressType],
      landmark: [this.address.landmark, Validators.compose([Validators.required])],
      city: [this.address.city, Validators.compose([Validators.required])],
      email: [this.address.email, Validators.email],
      customerId: [this.address.customerId],
      id: [this.address.id]
    });
  }

  getUser() {
    this.sharedDataService.getData('user')
      .then(_user => {
        this.user = _user;
        this.getContact();
      });
  }

  updateAddress() {
    this.utilService.createLoader()
      .then(loader => {
        loader.present();
        this.commandResourceService.updateAddressUsingPUT(this.addressForm.value)
          .subscribe(address => {
            this.logger.info(this,'Address Updated', address);
            loader.dismiss();
            this.dismissData(address);
          }, err => {
            loader.dismiss();
          })
      })
  }

  createAddress() {
    this.utilService.createLoader()
      .then(loader => {
        loader.present();
        this.addressForm.value.customerId = this.user.preferred_username;
        this.logger.info(this,'Address To Be Saved', this.addressForm.value);
        this.commandResourceService
          .createAddressUsingPOST(this.addressForm.value)
          .subscribe(address => {
            this.logger.info(this,'Address Saved', address);
            this.address = address;
            loader.dismiss();
            this.dismissData(this.address);
          }, err => {
            loader.dismiss();
          });
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  dismissData(address) {
    this.modalController.dismiss(address);
  }

}
