import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, AuxilaryLineItem, ComboLineItem, Store } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  @Input() order: Order;

  orderLines: OrderLine[] = [];

  products: Product[] = [];

  auxilaries = {};

  comboLineItems = {};


  @Input() store: Store;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private cartService: CartService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.logger.info(this.order);
    this.getOrderLines();
  }

  getOrderLines() {
    this.queryResource.findOrderLinesByOrderIdUsingGET(this.order.id)
    .subscribe(orderLines => {
      this.orderLines = orderLines;
      this.orderLines.forEach(o => {
        this.getProducts(o.productId);
      });
    });
  }

  getProducts(id) {
    this.queryResource.findProductByIdUsingGET(id)
    .subscribe(data => {
      this.products[data.id] = data;
      this.auxilaries[data.id] = [];
      this.getAuxilary(data , 0);
    });
  }

  getAuxilary(product: Product , i) {
    this.queryResource.findAuxilariesByProductIdUsingGET(product.id)
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

  dismiss() {
    this.modalController.dismiss();
  }
}
