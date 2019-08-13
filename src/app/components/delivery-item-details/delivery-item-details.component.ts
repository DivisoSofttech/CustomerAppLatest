import { CartService } from '../../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine } from 'src/app/api/models';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-delivery-item-details',
  templateUrl: './delivery-item-details.component.html',
  styleUrls: ['./delivery-item-details.component.scss'],
})
export class DeliveryItemDetailsComponent implements OnInit {

  @Input() orders: OrderLine[] = [];

  deliveryCharge;

  products = [];
  
  store;

  constructor(
    private cart: CartService,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
    this.getAllProductsFromOrders();
    this.getStore();
  }

  increaseProductCount(p) {
    this.cart.add(p);
  }

  decreaseProductCount(p) {
    this.cart.decrease(p);
  }

  removeTicket(index) {
    this.cart.removeTicket(index);
    console.log(this.orders.length);
    this.products.splice(index, 1);
  }

  getAllProductsFromOrders() {
    this.orders.forEach(o => {
      this.queryResource.findProductUsingGET(o.productId)
      .subscribe(p => {
        this.products.push(p);
      });
    });
  }

  getStore() {
    this.queryResource
      .findStoreByRegisterNumberUsingGET(this.cart.storeId)
      .subscribe(
        result => {
          console.log('Got Store', result);
          this.store = result;
        },
        err => {
          console.log('Error fetching store data', err);
        }
      );
  }

}
