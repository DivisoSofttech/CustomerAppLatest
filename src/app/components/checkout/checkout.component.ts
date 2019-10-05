import { WaitInformatonPopoverComponent } from './../wait-informaton-popover/wait-informaton-popover.component';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Util } from 'src/app/services/util';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalDisplayUtilService } from 'src/app/services/modal-display-util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {

  collectDeliveryInfoSubscription: Subscription;

  behaviouralSubjectSubscription: Subscription;


  loader: Promise<HTMLIonLoadingElement>;

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
    private popoverController: PopoverController,
    private displayModalService: ModalDisplayUtilService
      ) { }

  ngOnInit() {
    this.deliveryType = this.orderService.deliveryInfo.deliveryType;
    this.logger.info(this.orderService.deliveryInfo);
    this.logger.info(this.orderService.order);
    this.logger.info(this.orderService.customer);
    this.getCustomer();
    this.getOrderDetails();
    console.log('elivery type is ', this.deliveryType);
  }

  ngOnDestroy() {
    console.log('destroy calls');
    if(this.collectDeliveryInfoSubscription !== undefined) {
      this.collectDeliveryInfoSubscription.unsubscribe();
    }
  }
  getCustomer() {
    this.logger.info(this.orderService.customer);
    this.customer = this.orderService.customer;
  }

  getOrderDetails() {
    this.order = this.orderService.order;
  }

  setNote() {
    this.orderService.setNote(this.note);
  }

  setAddress(event) {
    this.selectedAddress = event;
    this.orderService.setAddress(this.selectedAddress);
  }

  addressSelectedEvent(event) {
    this.logger.info(event);
    this.setAddress(event);
  }

  checkOut() {
    this.setNote();
    this.util.createLoader().then(  loader => {
      this.behaviouralSubjectSubscription = this.orderService.orderResourceBehaviour.subscribe(resources => {
      console.log('Subscription called');
      if (this.orderService.resource.nextTaskName === 'Collect Delivery Info&Place Order') {
        console.log('In  if success');
        loader.dismiss();
        console.log('loader is dismissed');
        this.collectDeliveryInfoSubscription =  this.orderService.collectDeliveryInfo().subscribe((resource) => {
          this.orderService.setResource(resource);
          this.behaviouralSubjectSubscription.unsubscribe();
          this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
          console.log('Next task name is ' + resource.nextTaskId + ' Next task name '
          + resource.nextTaskName + ' selfid ' + resource.selfId + ' order id is ' + resource.orderId);
        }, (err) => {
        console.log('oops something went wrong while collecting deliveryinfo');
        this.util.createToast('Something went wrong try again', 'information-circle-outline');
        this.displayModalService.navigateToBasket();
      });
        if ( this.orderService.acceptType === 'manual') {
        this.displayModalService.presentWaitInfoPopover();
       } else {
        this.displayModalService.presentMakePayment();
       }
      } else {
        console.log('In else fail loader present');
        loader.present();
      }
    }, (err) => {
      this.displayModalService.navigateToBasket();
    });
  });
  }

  toggleBackButtonType(value) {
    this.showAddressBack = value;
  }

}
