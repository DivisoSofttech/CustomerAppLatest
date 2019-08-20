import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';

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
    private orderService: OrderService
  ) { }

  ngOnInit() {
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
    this.setNote();
    console.log(event);
    this.setAddress(event);
  }

  checkOut() {
    this.orderService.collectDeliveryInfo().subscribe((resource) => {
      this.orderService.resource = resource;
    }, (err) => { console.log('oops something went wrong while collecting deliveryinfo'); });
  }
}
