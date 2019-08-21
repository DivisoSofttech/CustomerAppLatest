import { CartService } from 'src/app/services/cart.service';
import { Injectable } from '@angular/core';
import { OrderCommandResourceService } from '../api/services';
import { CommandResource } from '../api/models';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';

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

  shop;

  constructor(
    private orderCommandService: OrderCommandResourceService,
    private storage: Storage,
    private cart: CartService,
    private logger: NGXLogger
  ) { }

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
    this.storage.get('user')
    .then(data => {
      //Store RegNo or Id?
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
    this.order.note = note;
  }
}
