import { Util } from './../../services/util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address, AddressDTO } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { OrderCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {


  addressForm: FormGroup;



  @Output() addressSelected = new EventEmitter();

  selectedAddress;

  @Input() showAddressPanel = false;

  showAddressLists = false;

  @Output() addressListShow = new EventEmitter(this.showAddressLists);

  @Input() customer;

  @Input() type = 'add';

  addresses: Address[] = [];

  address: AddressDTO = {};

  currentId = 1;

  ngOnInit() {

    this.addressForm = this.form.group({
      landmark: [this.address.landmark , Validators.compose([Validators.required])],
      addressType: [this.address.addressType , Validators.compose([Validators.required])],
      city: [this.address.city , Validators.compose([Validators.required])],
      houseNoOrBuildingName: [this.address.houseNoOrBuildingName , Validators.compose([Validators.required])],
      alternatePhone: [this.address.alternatePhone , Validators.compose([Validators.required])],
      name: [this.address.name , Validators.compose([Validators.required])],
      phone: [this.address.phone , Validators.compose([Validators.required])],
      pincode: [this.address.pincode , Validators.compose([Validators.required])],
      roadNameAreaOrStreet: [this.address.roadNameAreaOrStreet , Validators.compose([Validators.required])],
      state: [this.address.state , Validators.compose([Validators.required])],
      customerId: [this.address.customerId],
      id: [this.address.id]
    });


    this.logger.info('Address List' , this.customer);
    if (this.showAddressPanel === false) {
      this.getAllAdress(0);
    }
  }

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger,
    private orderCommandResource: OrderCommandResourceService,
    private form: FormBuilder,
    private util: Util
  ) {}

  getAllAdress(i) {
    this.orderCommandResource.getAllSavedAddressUsingGET({
      customerId: this.customer.preferred_username,
      page: i
    })
    .subscribe(paddress => {
      if (paddress.content.length > 0) {
        if (i === 0) {
          this.currentId = paddress.content[0].id;
          this.selectedAddress = paddress.content[0];
          this.addressSelected.emit(paddress.content[0]);
        }
      }
      paddress.content.forEach(a => {
        this.addresses.push(a);
      });
      ++i;
      if (i < paddress.totalPages) {
        this.getAllAdress(i);
      } else {
        this.logger.info('All Address Fetched');
      }
    });
  }

  saveAddress() {
    if (this.addressForm.valid) {
      this.util.createLoader()
      .then(loader => {
        loader.present();
        this.addressForm.value.customerId = this.customer.preferred_username;
        this.logger.info('Address To Be Saved', this.addressForm.value);
        this.orderCommandResource
        .createAddressUsingPOST(this.addressForm.value)
        .subscribe(address => {
          this.logger.info('Address Saved', address);
          this.address = address;
          loader.dismiss();
          this.dismiss(this.address);
        }, err => {
          loader.dismiss();
        });
      });
    } else {
      this.logger.info(this.addressForm.value);
      this.util.createToast('Fill in the required Fields');
    }
  }

  updateAddress() {
    if (this.addressForm.valid) {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.addressForm.value.customerId = this.address.customerId;
      this.addressForm.value.id = this.address.id;
      this.logger.info('Address To Be Updated', this.addressForm.value);
      this.orderCommandResource.updateAddressUsingPUT(this.addressForm.value)
      .subscribe(data => {
        this.logger.info('Address Updated ' , data);
        loader.dismiss();
        this.dismiss(data);
      },
      err => {
        loader.dismiss();
      });
    });
    } else {
      this.logger.info(this.addressForm.value);
      this.util.createToast('Fill in the required Fields');
    }
  }


  deleteAddress(id) {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.orderCommandResource.deleteAddressUsingDELETE(id)
      .subscribe(data => {
        this.util.createToast('Address Deleted');
        this.addresses = this.addresses.filter(ad => ad.id !== id);
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      });
    });
  }

  async addNewAddressModal() {
    const modal = await this.modalController.create({
      component: AddressListComponent,
      componentProps: { showAddressPanel: true , customer: this.customer}
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data !== undefined) {
        this.logger.info(data.data.name);
        this.addresses.push(data.data);
        this.selectedAddress = data.data;
        this.addressSelected.emit(data.data);
        this.currentId = data.data.id;
      }
    });

    modal.present();
  }

  async updateAddressModal(paddress: Address) {
    const modal = await this.modalController.create({
      component: AddressListComponent,
      componentProps: {
        showAddressPanel: true ,
        address: paddress,
        type: 'update'
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data !== undefined) {
        this.logger.info(data.data.name);
        this.addresses = this.addresses.filter(add  => add.id !== data.data.id);
        this.logger.info('Address Replaced '  , this.addresses);
        this.addresses.push(data.data);
        this.selectedAddress = data.data;
        this.addressSelected.emit(data.data);
        this.currentId = data.data.id;
      }
    });

    modal.present();
  }

  addressChanged(event) {
    this.logger.info('Address Changed');
    this.addresses.forEach(a => {
      if (a.id === event.id) {
        this.selectedAddress = event;
        this.toggleShowAddressList();
        this.addressSelected.emit(a);
      }
    });
  }

  dismiss(data?) {
    if (data !== undefined) {
      this.modalController.dismiss(data);
    } else {
      this.modalController.dismiss();
    }
  }

  toggleShowAddressList() {
    this.showAddressLists = !this.showAddressLists;
    this.addressListShow.emit(this.showAddressLists);
  }


}
