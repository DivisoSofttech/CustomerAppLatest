import { Component, OnInit, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { AddAddressComponent } from '../add-address/add-address.component';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
 
  @Input() mode="modal";

  user;

  addresses: any = [];

  selectedAddress = {
    id:0
  };

  showLoading = true;

  constructor(
    private modalController: ModalController,
    private logger: LogService,
    private queryResourceService: QueryResourceService,
    private sharedDataService: SharedDataService
  ){}

  ngOnInit(){
    this.getUser();
  }

  getUser() {
    this.sharedDataService.getData('user')
    .then(data => {
      this.user = data;
      this.sharedDataService.getData('address')
      .then(addresses => {
        if(addresses === null) {
          this.getAllAdress(0);
        } else {
          this.addresses = addresses.all;
          this.showLoading = false;
          this.getAddress();
        }
      })
    });
  }

  getAddress() {
    this.sharedDataService.getData('address')
    .then(addresses => {
      if(addresses != null)
      this.selectedAddress = addresses.selectedAddress
    });
  }

  updateStorageData(data) {
    this.sharedDataService.getData('address')
    .then(addresses => {
      if(addresses !== null) {
        if(addresses.selectedAddress.id === data.data.id) {
          addresses.selectedAddress = data.data;
        }
        addresses.all = this.addresses;
        this.sharedDataService.saveToStorage('address' , addresses)
        .then(()=> {
          this.dismissData(data.data);
        });  
      }
    });
  }

  getAllAdress(i) {
    this.queryResourceService.getAllSavedAddressUsingGET({
      customerId: this.user.preferred_username,
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
      }
    })
    await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  dismissData(address) {
    this.sharedDataService.saveToStorage('address' , 
    {
      'all': this.addresses,
      'selectedAddress': address
    });
    this.modalController.dismiss(address);
  }
}
