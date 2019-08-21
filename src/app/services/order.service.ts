import { CartService } from 'src/app/services/cart.service';
import { Injectable } from '@angular/core';
import { OrderCommandResourceService, OfferCommandResourceService } from '../api/services';

import { CommandResource, Order, DeliveryInfo, Address } from '../api/models';

import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order;
  resource: CommandResource;
  deliveryInfo: DeliveryInfo = {};
  customer;

  shop;

  constructor(
    private orderCommandService: OrderCommandResourceService,
    private storage: Storage,
    private cart: CartService,
    private logger: NGXLogger,
    private offerCommandService: OfferCommandResourceService
  ) { }

   initiateOrder() {
      console.log('Order is' + this.order);
      return this.orderCommandService.initiateOrderUsingPOST(this.order);
  }

  collectDeliveryInfo() {
    console.log('DeliveryInfo is' + this.deliveryInfo);
    return this.orderCommandService.collectDeliveryDetailsUsingPOST(
      {taskId: this.resource.nextTaskId, orderId: this.resource.selfId, deliveryInfo: this.deliveryInfo});
  }

  claimMyOffer(totalPrice) {
    return this.offerCommandService.checkOfferEligibilityUsingPOST({orderModel: {
      orderTotal: totalPrice
    }, customerId: this.customer.preferred_username});
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
    this.storage.get('user')
    .then(data => {
      // Store RegNo or Id?
      this.order.storeId = this.shop.regNo;
      this.order.email = data.email;
    });
  }

  setShop(shop) {
    this.logger.info('Shop Added to Order Service ' , shop);
    this.shop = shop;
  }

  setCustomer(customer) {
    this.customer = customer;
  }

  setNote(note) {
    this.deliveryInfo.deliveryNotes = note;
  }
}
