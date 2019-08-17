import { CartService } from '../../services/cart.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OrderLine, Store, Order } from 'src/app/api/models';
import { QueryResourceService, OfferCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-delivery-item-details',
  templateUrl: './delivery-item-details.component.html',
  styleUrls: ['./delivery-item-details.component.scss']
})
export class DeliveryItemDetailsComponent implements OnInit, OnDestroy {

  orders: OrderLine[] = [];

  totalPrice;

  deliveryCharge;

  products = [];

  store: Store;

  storeSetting;

  cartSubscription;

  constructor(
    private cart: CartService,
    private queryResource: QueryResourceService,
    private offerCommandResource: OfferCommandResourceService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartSubscription = this.cart.observableTickets.subscribe(data => {
      this.logger.info('Getting cart Details', data);
      this.totalPrice = this.cart.totalPrice;
      this.orders = data;
      this.storeSetting = this.cart.currentShopSetting;
      this.store = this.cart.currentShop;
      if (this.products.length === 0 && this.orders.length > 0) {
        this.getAllProductsFromOrders();
      }
    });
  }

  increaseProductCount(p) {
    this.cart.add(p);
  }

  decreaseProductCount(p) {
    this.cart.decrease(p);
  }

  removeOrder(o, p) {
    this.products = this.products.filter(pr => pr !== p);
    this.logger.info('Removing Order ', o);
    this.cart.removeOrder(o);
  }

  getAllProductsFromOrders() {
    this.orders.forEach(o => {
      this.queryResource.findProductUsingGET(o.productId).subscribe(p => {
        this.products.push(p);
      });
    });
  }

  getOffers() {
    let grandtotal = 0;
    this.orders.forEach(orderLine => {
      grandtotal += orderLine.pricePerUnit * orderLine.quantity;
    });
    this.offerCommandResource.checkOfferEligibilityUsingPOST({
      orderTotal: grandtotal
    })
    .subscribe(data => {
      console.log(data);
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
