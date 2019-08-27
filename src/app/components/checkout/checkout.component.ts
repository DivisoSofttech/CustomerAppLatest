import { WaitInformatonPopoverComponent } from './../wait-informaton-popover/wait-informaton-popover.component';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Util } from 'src/app/services/util';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';
import { load } from 'google-maps';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

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
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.deliveryType = this.orderService.deliveryInfo.deliveryType;
    console.log(this.orderService.deliveryInfo);
    console.log(this.orderService.order);
    console.log(this.orderService.customer);
    this.getCustomer();
    this.getOrderDetails();
  }

  getCustomer() {
    console.log(this.orderService.customer);
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
    console.log(event);
    this.setAddress(event);
  }

  checkOut() {
    this.setNote();
    this.util.createLoader().then(loader => {
      loader.present();
      this.orderService.collectDeliveryInfo().subscribe((resource) => {
        loader.dismiss();
        this.orderService.resource = resource;
        console.log('Next task name is ' + resource.nextTaskId + ' Next task name '
        + resource.nextTaskName + ' selfid ' + resource.selfId + ' order id is ' + resource.orderId);
        if ( resource.nextTaskName === 'Accept Order') {
          this.presentWaitInfoPopover();
        } else {
          this.presentmakePayment();
        }
      }, (err) => { console.log('oops something went wrong while collecting deliveryinfo'); loader.dismiss(); });
    });
  }

  async presentmakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  async presentWaitInfoPopover() {
    const popover = await this.popoverController.create({
      component: WaitInformatonPopoverComponent
    });
    return await popover.present();
  }

}
