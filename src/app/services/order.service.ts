import { Injectable } from '@angular/core';
import { OrderCommandResourceService } from '../api/services';
import { CommandResource, Order, DeliveryInfo, Address } from '../api/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order: Order;
  resource: CommandResource;
  deliveryInfo: DeliveryInfo = {};
  customer;

  constructor(private orderCommandService: OrderCommandResourceService) { }

   initiateOrder() {
      console.log('Order is' + this.order);
     return this.orderCommandService.initiateOrderUsingPOST(this.order);
  }

  collectDeliveryInfo() {
    console.log('DeliveryInfo is' + this.deliveryInfo);
    return this.orderCommandService.collectDeliveryDetailsUsingPOST(
      {taskId: this.resource.nextTaskId, orderId: this.resource.selfId, deliveryInfo: this.deliveryInfo});
  }

  setResource(resource: CommandResource) {
    this.resource = resource;
  }

  setDeliveryType(deliveryType) {
    this.deliveryInfo.deliveryType = deliveryType;
  }

  setDeliveryCharge(deliveryCharge) {
    this.deliveryInfo.deliveryCharge = deliveryCharge;
  }
  setAddress(address)  {
    this.deliveryInfo.deliveryAddress = address;
  }

  setOrder(order) {
    this.order = order;
  }

  setCustomer(customer) {
    this.customer = customer;
  }

  setNote(note) {
    this.deliveryInfo.deliveryNotes = note;
  }
}
