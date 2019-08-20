import { Injectable } from '@angular/core';
import { OrderCommandResourceService } from '../api/services';
import { CommandResource } from '../api/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  address = '';
  nextTaskId: string;
  nextTaskName: string;
  orderId: string;
  order;
  resource: CommandResource;

  deliveryType;

  customer;

  constructor(private orderCommandService: OrderCommandResourceService) { }

   initiateOrder() {
     console.log('Order is' + this.order);
     return this.orderCommandService.initiateOrderUsingPOST(this.order);
  }

  setResource(resource: CommandResource) {
    this.resource = resource;
  }

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
