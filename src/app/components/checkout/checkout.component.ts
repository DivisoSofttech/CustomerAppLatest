import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  customer;

  selectedAddress;  

  note;

  order: Order;
  
  deliveryType: any;

  constructor(
    private orderService: OrderService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    console.log(this.orderService.deliveryType);
    console.log(this.orderService.order);
    console.log(this.orderService.customer);
    console.log(this.orderService.address);
    this.getCustomer();
    this.getOrderDetails();
  }

  getCustomer() {
    console.log(this.orderService.customer);
    this.customer = this.orderService.customer;
  }

  getOrderDetails() {
    this.order = this.orderService.order;
    this.deliveryType = this.orderService.deliveryType;
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
    this.logger.info(' ----------------------------- ');
    this.logger.info('Customer : ' , this.customer);
    this.logger.info('Order : ' , this.order);
    this.logger.info('Order Type : ' , this.deliveryType);
    this.logger.info('Note : ' , this.note);
    this.logger.info('Address : ' , this.selectedAddress);
    this.logger.info(' ----------------------------- ');
  }
}
