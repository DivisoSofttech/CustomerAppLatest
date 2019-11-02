import { Util } from './../../services/util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address, AddressDTO } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { OrderCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddAddressComponent } from '../add-address/add-address.component';
import { Storage } from '@ionic/storage';

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
    private orderCommandResource: OrderCommandResourceService,
    private form: FormBuilder,
    private util: Util,
    private storage: Storage
  ){}

  ngOnInit(){
    this.getCustomer();
  }

  getCustomer() {
    this.storage.get('user')
    .then(data => {
      this.customer = data;
      this.getAllAdress(0);
    });
  }

  getAllAdress(i) {
    
    this.orderCommandResource.getAllSavedAddressUsingGET({
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
      console.error(data.data);
      this.addresses.forEach((element , index)=> {
        if(element.id === data.data.id) {
          console.log(element , index);
          this.addresses[index] = data.data;
          console.log(this.addresses);
        }
      })
    })
  
    await modal.present();
  
  }

  deleteAddress(id) {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.orderCommandResource.deleteAddressUsingDELETE(id)
      .subscribe((data:any) => {
        this.util.createToast('Address Deleted' , data);
        this.addresses = this.addresses.filter(ad => ad.id !== id);
        this.modalController.getTop()
        .then(element => {
          this.dismissData({
            deleted:true,
            deletedId: id
          });
        });  
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      });
    });
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
    this.modalController.dismiss(address);
  }
}
