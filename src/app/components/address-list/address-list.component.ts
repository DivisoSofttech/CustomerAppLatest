import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { OrderCommandResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  
  @Output() addressSelected = new EventEmitter();

  @Input() showAddressPanel = false;

  @Input() customer;

  addresses: Address[] = [];

  address: Address = {};

  currentId = 1;

  ngOnInit() {
    if (this.showAddressPanel === false) {
      this.getAllAdress(0);
    }
  }

  constructor(
    private modalController: ModalController,
    private orderCommandResource: OrderCommandResourceService
  ) {}

  getAllAdress(i) {
    this.orderCommandResource.getAllSavedAddressUsingGET({
      customerId: this.customer.regNo,
      page: i
    })
    .subscribe(paddress => {
      paddress.content.forEach(a => {
        this.addresses.push(a);
      });
      ++i;
      if(i < paddress.totalPages) {
        this.getAllAdress(i);
      } else {
        console.log('All Address Fetched');
      }
    });
  }

  saveAddress() {
    this.orderCommandResource
    .createAddressUsingPOST(this.address)
    .subscribe(address => {
      console.log(address);
      this.address = address;
      this.dismiss(this.address);
    });
  }

  async addNewAddress() {
    const modal = await this.modalController.create({
      component: AddressListComponent,
      componentProps: { showAddressPanel: true }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data !== undefined) {
        console.log(data.data.name);
        this.addresses.push(data.data);
        this.addressSelected.emit(data.data);
        this.currentId = data.data.id;
      }
    });

    modal.present();
  }

  addressChanged(event) {
    this.addresses.forEach(a => {
      if(a.id == event.detail.value) {
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

  
}
