import { SharedDataService } from 'src/app/services/shared-data.service';
import { Util } from 'src/app/services/util';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { ModalController, PopoverController, NavController } from '@ionic/angular';
import { ModalDisplayUtilService } from 'src/app/services/modal-display-util.service';
import { Subscription } from 'rxjs';
import { AddressListComponent } from '../address-list/address-list.component';
import { ErrorService } from 'src/app/services/error.service';
import { LogService } from 'src/app/services/log.service';
import { PaymentflowNavComponent } from '../paymentflow-nav/paymentflow-nav.component';
import { WaitInformatonPopoverComponent } from '../wait-informaton-popover/wait-informaton-popover.component';

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
    private logger: LogService,
    private util: Util,
    private modalController: ModalController,
    private navController: NavController,
    private sharedData: SharedDataService,
    private errorService: ErrorService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.getRequiredDetails();
  }

  saveDataToStorage() {
    this.sharedData.saveToStorage('checkout', {
      note: this.note
    });
  }

  getDataFromStorage() {
    this.sharedData.getData('checkout')
      .then(data => {
        if (data !== null) {
          this.note = data.note;
        }
      });
  }

  getRequiredDetails() {
    this.deliveryType = this.orderService.deliveryInfo.deliveryType;
    this.logger.info(this, 'OrderInfo', {
      deliveryInfo: this.orderService.deliveryInfo,
      order: this.orderService.order,
      customer: this.orderService.customer
    });
    this.getCustomer();
    this.getOrderDetails();
    this.getDataFromStorage();
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
        if (addresses != null)
          this.selectedAddress = addresses.selectedAddress
        this.setAddress();
      });
  }

  setAddress() {
    this.logger.info(this.selectedAddress);
    this.orderService.setAddress(this.selectedAddress);
  }

  async startPayment() {
    const modal = await this.modalController.create({
      component: PaymentflowNavComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async presentWaitInfoPopover() {
    const popover = await this.popoverController.create({
      component: WaitInformatonPopoverComponent
    });
    return await popover.present();
  }

  processPayment() {
    this.logger.info(this, 'Updating DeliveryInfo ', this.orderService.deliveryInfo);
    this.orderService.updateDeliveryInfo().subscribe(response => {
      this.logger.info(this, 'Update DeliveryInfo result is ', response);
    });
    switch (this.orderService.acceptType) {
      case 'manual': this.presentWaitInfoPopover(); break;
      default: this.startPayment();
    }
  }

  collectDeliveryInfo() {
    this.logger.info(this, 'Creating DeliveryInfo');
    this.util.createLoader().then(loader => {
      this.behaviouralSubjectSubscription = this.orderService.orderResourceBehaviour.subscribe(resources => {
        if (this.orderService.resource.nextTaskName === 'Collect Delivery Info&Place Order') {
          loader.dismiss();
          this.collectDeliveryInfoSubscription = this.orderService.collectDeliveryInfo().subscribe((resource) => {
            this.orderService.setResource(resource);
            this.behaviouralSubjectSubscription.unsubscribe();
            this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
            this.logger.info(this, 'Next task name is ' + resource.nextTaskId + ' Next task name '
              + resource.nextTaskName + ' selfid ' + resource.selfId + ' order id is ' + resource.orderId);
          }, 
          (err) => {
            this.logger.error(this, 'oops something went wrong while collecting deliveryinfo ', err);
            this.behaviouralSubjectSubscription.unsubscribe();
            this.util.createToast('Something went wrong try again', 'information-circle-outline');
            this.navigateBack();
            this.errorService.showErrorModal(this);
          });
          switch(this.orderService.acceptType) {
            case 'manual': this.presentWaitInfoPopover();break;
            default:this.startPayment();
          }
        } else {
          this.logger.info(this, 'In else fail loader present');
          loader.present();
        }
      }, 
      (err) => {
        this.navigateBack();  
      });
    });
  }

  checkOut() {
    this.logger.info(this, 'Delivery info is  ', this.order.deliveryInfo);
    this.setNote();
    if (this.orderService.resource.nextTaskName === 'Process Payment') {
      this.processPayment();
    } else {
      this.collectDeliveryInfo();
    }
  }

  toggleBackButtonType(value) {
    this.showAddressBack = value;
  }

  navigateBack() {
    this.navController.back();
  }

  ngOnDestroy() {
    this.collectDeliveryInfoSubscription ? this.collectDeliveryInfoSubscription.unsubscribe() : undefined;
    this.behaviouralSubjectSubscription ? this.behaviouralSubjectSubscription.unsubscribe() : undefined;
  }

}
