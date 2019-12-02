import { OrderService } from 'src/app/services/order.service';
import { NGXLogger } from 'ngx-logger';
import { Store } from './../../api/models/store';
import { QueryResourceService } from 'src/app/api/services';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {

  store: Store = {
    imageLink:'',
    storeUniqueId:''
  };;

  constructor(
    private cart: CartService,
    private  queryResource: QueryResourceService,
    private logger: NGXLogger,
    private orderService: OrderService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.logger.info('Basket Page');
    if (this.cart.currentShop !== undefined) {
      this.getStore();
    }
  }

  getStore() {
    this.logger.info('Basket Page Getting Store' ,     this.cart.currentShop.regNo);
    this.queryResource.findStoreByRegisterNumberUsingGET(this.cart.currentShop.regNo)
    .subscribe(store => {
      if(this.store !== undefined) {
        this.store = store;
        this.orderService.acceptType = store.storeSettings.orderAcceptType;
        console.log(' Accept type is ', this.orderService.acceptType);  
      }
    });
  }

  clearCart() {
    this.cart.emptyCart();
    this.orderService.resource = {};
    this.orderService.offer = undefined;
    this.orderService.deliveryInfo = {};
  }

}
