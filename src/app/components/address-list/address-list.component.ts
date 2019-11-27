import { Component, OnInit, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { AddAddressComponent } from '../add-address/add-address.component';
import { Storage } from '@ionic/storage';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
 
  @Input() mode="modal";

  customer;

  addresses: any = [];

  showLoading = true;

  constructor(
    private modalController: ModalController,
    private logger: NGXLogger,
    private queryResourceService: QueryResourceService,
    private sharedData: SharedDataService
  ){}

  ngOnInit(){
    this.getCustomer();
  }

  getCustomer() {
    this.sharedData.getData('user')
    .then(data => {
      this.customer = data;
      this.sharedData.getData('address')
      .then(addresses => {
        if(addresses === null) {
          this.getAllAdress(0);
        } else {
          this.addresses = addresses.all;
          this.showLoading = false;
        }
      })
    });
  }

  updateStorageData(data) {
    this.sharedData.getData('address')
    .then(addresses => {
      if(addresses !== null) {
        if(addresses.selectedAddress.id === data.data.id) {
          addresses.selectedAddress = data.data;
        }
        addresses.all = this.addresses;
        this.sharedData.saveToStorage('address' , addresses);  
      }
    });
  }

  getAllAdress(i) {
    this.queryResourceService.getAllSavedAddressUsingGET({
      customerId: this.customer.preferred_username,
      page: i
    })
    .subscribe(paddress => {
      this.showLoading = false;
      paddress.content.forEach(a => {
        this.addresses.push(a);
      });
      ++i;
      if (i < paddress.totalPages) {
        this.getAllAdress(i);
      } else {
        this.logger.info('All Address Fetched');
        if(this.addresses.length>0) {
          this.updateStorageData(this.addresses[0]);
        }
      }
    });
  }

  async editAddress(address) {
    const modal = await this.modalController.create({
    component: AddAddressComponent,
    componentProps: { address: address , mode:'update'}
    });

    modal.onDidDismiss()
    .then(data=> {
      if(data.data) {
        this.addresses.forEach((element , index)=> {
          if(element.id === data.data.id) {
            this.addresses[index] = data.data;
            this.updateStorageData(data);
          }
        })  
      }
    });
    await modal.present();
  }
  
  async addAddressModal() {
    const modal = await this.modalController.create({
    component: AddAddressComponent,
    componentProps: {mode:'create'}
    });

    modal.onDidDismiss()
    .then(data => {
      if(data.data !== undefined) {
        this.addresses.push(data.data);
        this.updateStorageData(data);
        this.modalController.getTop()
        .then(element => {
          this.dismissData(data.data);
        });  
      }
    })
  
    await modal.present();
  
  }

  dismiss() {
    this.modalController.dismiss();
  }

  dismissData(address) {
    this.sharedData.saveToStorage('address' , 
    {
      'all': this.addresses,
      'selectedAddress': address
    });
    this.modalController.dismiss(address);
  }
}
