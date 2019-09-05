import { Util } from './../../services/util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { OrderCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  @Output() addressSelected = new EventEmitter();

  selectedAddress;

  @Input() showAddressPanel = false;

  showAddressLists = false;

  @Output() addressListShow = new EventEmitter(this.showAddressLists);

  @Input() customer;

  @Input() type = 'add';

  addresses: Address[] = [];

  address: Address = {};

  currentId = 1;

  ngOnInit() {
    this.logger.info('Address List' , this.customer);
    if (this.showAddressPanel === false) {
      this.getAllAdress(0);
    }
  }

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger,
    private orderCommandResource: OrderCommandResourceService,
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
      if(i < paddress.totalPages) {
        this.getAllAdress(i);
      } else {
        this.logger.info('All Address Fetched');
      }
    });
  }

  saveAddress() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.address.customerId = this.customer.preferred_username;
      this.logger.info('Address To Be Saved', this.address);
      this.orderCommandResource
      .createAddressUsingPOST(this.address)
      .subscribe(address => {
        this.logger.info('Address Saved', address);
        this.address = address;
        loader.dismiss();
        this.dismiss(this.address);
      }, err => {
        loader.dismiss();
      });
    });
  }

  updateAddress() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.logger.info('Address To Be Updated', this.address);
      this.orderCommandResource.updateAddressUsingPUT(this.address)
      .subscribe(data => {
        this.logger.info('Address Updated ' , this.address);
        loader.dismiss();
        this.dismiss(this.address);
      },
      err => {
        loader.dismiss();
      });
    });
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
        this.addresses.forEach((add , i) => {
          if(add.id === data.data.id) {
            this.address[i] = data.data;
          }
        });
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
