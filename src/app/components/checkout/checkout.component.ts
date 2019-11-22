import { SharedDataService } from 'src/app/services/shared-data.service';
import { Util } from 'src/app/services/util';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { ModalController} from '@ionic/angular';
import { ModalDisplayUtilService } from 'src/app/services/modal-display-util.service';
import { Subscription } from 'rxjs';
import { AddressListComponent } from '../address-list/address-list.component';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {

  collectDeliveryInfoSubscription: Subscription;

  behaviouralSubjectSubscription: Subscription;

  showAddressBack = false;
  customer;
  selectedAddress;
  note: string;
  order: Order;
  deliveryType: any;

  constructor(
    private orderService: OrderService,
    private logger: NGXLogger,
    private util: Util,
    private modalController: ModalController,
    private displayModalService: ModalDisplayUtilService,
    private sharedData: SharedDataService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.deliveryType = this.orderService.deliveryInfo.deliveryType;
    this.logger.info(this.orderService.deliveryInfo);
    this.logger.info(this.orderService.order);
    this.logger.info(this.orderService.customer);
    this.getCustomer();
    this.getOrderDetails();
    this.getDataFromStorage();
    console.log('elivery type is ', this.deliveryType);
  }

  saveDataToStorage() {
    this.sharedData.saveToStorage('checkout' , {
      note: this.note
    });
  }

  getDataFromStorage() {
    this.sharedData.getData('checkout')
    .then(data => {
      if(data !== null) {
        this.note = data.note;
      }
    });
  }

  ngOnDestroy() {
    console.log('destroy calls');
    if (this.collectDeliveryInfoSubscription !== undefined) {
      this.collectDeliveryInfoSubscription.unsubscribe();
    }

    if (this.behaviouralSubjectSubscription !== undefined) {
        this.behaviouralSubjectSubscription.unsubscribe();
    }
  }

  getCustomer() {
    this.logger.info(this.orderService.customer);
    this.customer = this.orderService.customer;
    this.getAddress();
  }

  getOrderDetails() {
    this.order = this.orderService.order;
  }

  async showAddresses() {
    const modal = await this.modalController.create({
    component: AddressListComponent
    });

    modal.onDidDismiss()
    .then(data => {
      this.getAddress();
    });
    await modal.present();

  }

  setNote() {
    this.orderService.setNote(this.note);
  }

  getAddress() {
    this.sharedData.getData('address')
    .then(addresses => {
      if(addresses != null)
      this.selectedAddress = addresses.selectedAddress
      this.setAddress();
    });
  }
  setAddress() {
    this.logger.info(this.selectedAddress);
    this.orderService.setAddress(this.selectedAddress);
  }

  checkOut() {

    this.logger.info('Delivery info is  ' , this.order.deliveryInfo);
    this.setNote();
    if ( this.orderService.resource.nextTaskName === 'Process Payment' ) {
      this.logger.info('In for updating the deliveryinfo >>>>>>>>>>> ', this.orderService.deliveryInfo);
      this.orderService.updateDeliveryInfo().subscribe(response => {
          this.logger.info('Update deliveryInfo result is ', response);
        });
      if ( this.orderService.acceptType === 'manual') {
          this.displayModalService.presentWaitInfoPopover();
         } else {
          this.displayModalService.presentMakePayment();
         }
    } else {
    this.logger.info('In for creating new deliveryInfo >>>>>>>>>>>>>>');
    this.util.createLoader().then(  loader => {
      this.behaviouralSubjectSubscription = this.orderService.orderResourceBehaviour.subscribe(resources => {
        this.logger.info('Subscription called');
        if (this.orderService.resource.nextTaskName === 'Collect Delivery Info&Place Order') {
        this.logger.info('In  if success');
        loader.dismiss();
        this.logger.info('loader is dismissed');
        this.collectDeliveryInfoSubscription =  this.orderService.collectDeliveryInfo().subscribe((resource) => {
          this.orderService.setResource(resource);
          this.behaviouralSubjectSubscription.unsubscribe();
          this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
          this.logger.info('Next task name is ' + resource.nextTaskId + ' Next task name '
          + resource.nextTaskName + ' selfid ' + resource.selfId + ' order id is ' + resource.orderId);
        }, (err) => {
          this.logger.error('oops something went wrong while collecting deliveryinfo ', err);
          this.behaviouralSubjectSubscription.unsubscribe();
          this.util.createToast('Something went wrong try again', 'information-circle-outline');
          this.displayModalService.navigateToBasket();
          this.errorService.showErrorModal(this);
      });
        if ( this.orderService.acceptType === 'manual') {
        this.displayModalService.presentWaitInfoPopover();
       } else {
        this.displayModalService.presentMakePayment();
       }
      } else {
        this.logger.info('In else fail loader present');
        loader.present();
      }
    }, (err) => {
      this.displayModalService.navigateToBasket();
    });
  });
}
  }

  toggleBackButtonType(value) {
    this.showAddressBack = value;
  }

}
