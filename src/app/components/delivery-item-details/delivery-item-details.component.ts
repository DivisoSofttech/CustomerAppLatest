import { CartService } from '../../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine, Store } from 'src/app/api/models';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-delivery-item-details',
  templateUrl: './delivery-item-details.component.html',
  styleUrls: ['./delivery-item-details.component.scss'],
})
export class DeliveryItemDetailsComponent implements OnInit {

  @Input() orders: OrderLine[] = [];

  totalPrice;

  deliveryCharge;

  products = [];
  
  @Input() store: Store;

  @Input() storeSetting;

  constructor(
    private cart: CartService,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
    this.getAllProductsFromOrders();
    this.getcartDetails();
  }

  getcartDetails() {
    this.cart.observableTickets
    .subscribe(data => {
      this.orders = data;
      this.totalPrice = this.cart.totalPrice;
    });
  }

  increaseProductCount(p) {
    this.cart.add(p);
  }

  decreaseProductCount(p) {
    this.cart.decrease(p);
  }

  removeOrder(o) {
    this.cart.removeOrder(o);
  }

  getAllProductsFromOrders() {
    this.orders.forEach(o => {
      this.queryResource.findProductUsingGET(o.productId)
      .subscribe(p => {
        this.products.push(p);
      });
    });
  }

  getOffers() {
  
  }

  // Methods

}
