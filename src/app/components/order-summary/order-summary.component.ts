import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, Store, CommandResource } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
@Input() order: Order;

  orderLines: OrderLine[] = [];

  products: Product[] = [];

  auxilaries = {};

  comboLineItems = {};

  taskDetailsSubscription: Subscription;
  orderLinesByOrderIdSubscription: Subscription;
  productByProductIdSubscrption: Subscription;
  auxilayByProductIdSubscription: Subscription;

  @Input() store: Store;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private cartService: CartService,
    private modalController: ModalController,
    private navController: NavController,
    private orderService: OrderService,
    private util: Util
  ) { }

  ngOnInit() {
    this.logger.info(this.order);
    this.getOrderLines();
  }

  ngOnDestroy() {
    console.log('Ng Destroy calls in orderDetail component');
    if (this.taskDetailsSubscription !== undefined) {
      this.taskDetailsSubscription.unsubscribe();
    }
    this.orderLinesByOrderIdSubscription !== undefined?this.orderLinesByOrderIdSubscription.unsubscribe():null;
    this.productByProductIdSubscrption !== undefined?this.productByProductIdSubscrption.unsubscribe():null;
    this.auxilayByProductIdSubscription !== undefined?this.auxilayByProductIdSubscription.unsubscribe():null;
  }

  getOrderLines() {
    this.orderLinesByOrderIdSubscription = this.queryResource.findOrderLinesByOrderIdUsingGET(this.order.id)
    .subscribe(orderLines => {
      this.orderLines = orderLines;
      this.orderLines.forEach(o => {
        this.getProducts(o.productId);
      });
    });
  }

  getProducts(id) {
   this.productByProductIdSubscrption =  this.queryResource.findProductByIdUsingGET(id)
    .subscribe(data => {
      this.products[data.id] = data;
      this.auxilaries[data.id] = [];
      this.getAuxilary(data , 0);
    });
  }

  getAuxilary(product: Product , i) {
    this.auxilayByProductIdSubscription = this.queryResource.findAuxilariesByProductIdUsingGET(product.id)
    .subscribe(pauxProducts => {
      pauxProducts.content.forEach(apr => {
        this.auxilaries[product.id].push(apr);
      });
      ++i;
      if (i < pauxProducts.totalPages) {
        this.getAuxilary(product , i);
      } else {
        this.cartService.addAuxilary(product , this.auxilaries[product.id]);
      }

    });
  }

  reorder() {
    if (this.cartService.currentShopId === 0) {
      this.addToCart();
    } else if (this.cartService.currentShopId === this.store.id) {
      this.addToCart();
    } else {
      this.cartService.presentAlert();
    }
  }

  addToCart() {
    this.cartService.addShop(this.store);
    this.orderLines.forEach(o => {
      if (o.requiedAuxilaries === null) {
       delete o.requiedAuxilaries;
      }
      this.cartService.addOrder(o);
    });
  }

  dismiss(value) {
    this.modalController.dismiss(value);
  }

}
