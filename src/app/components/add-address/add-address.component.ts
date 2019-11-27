import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {

  addressForm: FormGroup;
  
  @Input() address: any = {};

  @Input() mode = 'create';

  customer;

  constructor(
    private modalController: ModalController,
    private commandResourceService: CommandResourceService,
    private form: FormBuilder,
    private util: Util,
    private logger: NGXLogger,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get('user')
    .then(data => {
      this.customer = data;
    })
    this.addressForm = this.form.group({
      name: [this.address.name , Validators.compose([Validators.required])],
      phone: [this.address.phone , Validators.compose([Validators.required])],
      pincode: [this.address.pincode , Validators.compose([Validators.required])],
      houseNoOrBuildingName: [this.address.houseNoOrBuildingName , Validators.compose([Validators.required])],

      addressType: [this.address.addressType],
      landmark: [this.address.landmark, Validators.compose([Validators.required])],
      city: [this.address.city, Validators.compose([Validators.required])],
      email: [this.address.email , Validators.email],
      customerId: [this.address.customerId],
      id: [this.address.id]
    });
  }

  updateAddress() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.commandResourceService.updateAddressUsingPUT(this.addressForm.value)
      .subscribe(address => {
        this.logger.info('Address Saved', address);
        loader.dismiss();
        this.dismissData(address);
      }, err => {
        loader.dismiss();
      })
    })
  }

  createAddress() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.addressForm.value.customerId = this.customer.preferred_username;
      this.logger.info('Address To Be Saved', this.addressForm.value);
      this.commandResourceService
      .createAddressUsingPOST(this.addressForm.value)
      .subscribe(address => {
        this.logger.info('Address Saved', address);
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
