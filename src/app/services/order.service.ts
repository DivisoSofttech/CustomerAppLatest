import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  address = '';

  order;

  deliveryType;

  customer;

  constructor() { }

  setDeliveryType(deliveryType) {
    this.deliveryType = deliveryType;
  }

  setAddress(address)  {
    this.address = address;
  }

  setOrder(order) {
    this.order = order;
  }

  setCustomer(customer) {
    this.customer = customer;
  }

  setNote(note) {
    this.order.note = note;
  }
}
