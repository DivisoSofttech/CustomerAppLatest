import { WaitInformatonPopoverComponent } from './../wait-informaton-popover/wait-informaton-popover.component';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Util } from 'src/app/services/util';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalDisplayUtilService } from 'src/app/services/modal-display-util.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

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
    this.util.createLoader().then(loader => {
      loader.present();
      this.orderService.collectDeliveryInfo().subscribe((resource) => {
        loader.dismiss();
        this.orderService.resource = resource;
        this.logger.info('Next task name is ' + resource.nextTaskId + ' Next task name '
        + resource.nextTaskName + ' selfid ' + resource.selfId + ' order id is ' + resource.orderId);
        if ( resource.nextTaskName === 'Accept Order') {
          this.displayModalService.presentWaitInfoPopover();
        } else {
          this.displayModalService.presentMakePayment();
        }
      }, (err) => {
      console.log('oops something went wrong while collecting deliveryinfo');
      loader.dismiss();
      this.util.createToast('Something went wrong try again', 'information-circle-outline');
      this.displayModalService.navigateToBasket();
    });
    });
  }

  toggleBackButtonType(value) {
    this.showAddressBack = value;
  }

}
