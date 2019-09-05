import { Injectable } from '@angular/core';
import { Product, StockCurrent, OrderLine, Store, AuxilaryLineItem } from '../api/models';
import { BehaviorSubject } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { QueryResourceService } from '../api/services';
import { Util } from './util';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  currentShopId = 0;
  orderLines: OrderLine[] = [];
  totalPrice = 0;
  storeId;
  observableTickets: BehaviorSubject<OrderLine[]>;
  observablePrice: BehaviorSubject<number>;
  currentShop: Store;
  currentShopSetting;
  auxilaryItems = {};
  currentDeliveryTypes;
  MAX_ORDERS = 10;

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private queryResource: QueryResourceService,
    private util: Util,
    private logger: NGXLogger
  ) {
    this.observableTickets = new BehaviorSubject<OrderLine[]>(this.orderLines);
    this.observablePrice = new BehaviorSubject<number>(this.totalPrice);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Checkout First',
      message: 'Checkout From ' + this.currentShop.name,
      buttons: [
        {
          text: 'Go To Cart',
          cssClass: 'secondary',
          handler: (blah) => {
            this.navController.navigateForward('/basket');
          }
        }
      ]
    });
    await alert.present();
  }

  addProduct(product: Product, stockCurrent: StockCurrent, shop: Store) {

    if (this.currentShopId === 0) {
      this.currentShop = shop;
      this.currentShopId = shop.id;
      this.storeId = this.currentShop.regNo;
      this.getStoreSettings();
      this.getStoreDeliveryType();
    }

    if (this.currentShopId === shop.id) {

      let added = false;
      this.orderLines.forEach(orderLine => {
        if (orderLine.productId === product.id) {
          orderLine.quantity++;
          orderLine.total += orderLine.pricePerUnit;
          this.updateCart();
          added = true;
        }
      });
      if (!added) {
        const orderLine: OrderLine = {
          productId: product.id,
          quantity: 1,
          pricePerUnit: stockCurrent.sellPrice,
          total: stockCurrent.sellPrice
        };
        this.orderLines.push(orderLine);
        this.updateCart();
      }

      return true;

    } else {
      this.presentAlert();
      return false;
    }
  }

  getStoreSettings() {
    this.currentShopSetting = this.currentShop.storeSettings;
    this.getStoreDeliveryType();
  }

  getStoreDeliveryType() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.queryResource
      .findAllDeliveryTypesByStoreIdUsingGET({
        storeId: this.currentShopId
      })
      .subscribe(
        success => {
          loader.dismiss();
          this.logger.info('Got Store Delivery Types ' , success.content);
          this.currentDeliveryTypes = success.content;
          this.observableTickets.next(this.orderLines);
        },
        err => {
          loader.dismiss();
        }
      );
    });
  }

  add(product: Product) {
    this.orderLines.forEach(orderLine => {
      if (orderLine.productId === product.id) {
        orderLine.quantity++;
        orderLine.total += orderLine.pricePerUnit;
        this.updateCart();
      }
    });
  }


  removeProduct(stockCurrent: StockCurrent) {
    this.orderLines.forEach(orderLine => {
      if (orderLine.productId === stockCurrent.product.id) {
        orderLine.quantity--;
        orderLine.total -= orderLine.pricePerUnit;
        if (orderLine.quantity === 0) {
          this.removeTicket(this.orderLines.indexOf(orderLine));
        }
        this.updateCart();
      }
    });
  }

  removeTicket(index) {
    this.orderLines.splice(index, 1);
    this.updateCart();
  }

  // New Methods

  getCartDetails() {
    return this.observableTickets;
  }

  calculatePrice() {
    let orderTotal = 0;
    let auxilaryTotal = 0;
    this.orderLines.forEach(orderLine => {
      if (orderLine.requiedAuxilaries !== undefined) {
        auxilaryTotal = 0;
        orderLine.requiedAuxilaries.forEach(auxilaryOrderLine => {
          auxilaryOrderLine.total = auxilaryOrderLine.quantity * auxilaryOrderLine.pricePerUnit;
          auxilaryTotal += auxilaryOrderLine.total;
        });
      }
      orderLine.total = (orderLine.quantity * orderLine.pricePerUnit) + auxilaryTotal;
      orderTotal += orderLine.total;
    });
    this.totalPrice = orderTotal;
  }

  updateCart() {
    this.totalPrice = 0;
    if (this.orderLines.length === 0) {
      this.currentShop = {};
      this.currentShopId = 0;
    }
    this.calculatePrice();
    this.observableTickets.next(this.orderLines);
    this.observablePrice.next(this.totalPrice);
  }

  emptyCart() {
    this.orderLines = [];
    this.currentShopId = 0;
    this.currentShop = undefined;
    this.updateCart();
  }

  removeOrder(order: OrderLine) {
    console.warn('Previous Length' , this.orderLines.length);
    this.orderLines = this.orderLines.filter(ol => ol !== order);
    console.warn('After Filter Length' , this.orderLines.length);
    this.updateCart();
  }

  addAuxilary(p: Product , a: AuxilaryLineItem[]) {
    if (a !== undefined) {
      this.auxilaryItems[p.id]  = a;
    }
  }

  addShop(shop) {
    if (this.currentShopId === 0) {
      this.currentShop = shop;
      this.currentShopId = shop.id;
      this.storeId = this.currentShop.regNo;
      this.getStoreSettings();
    }
  }

  addOrder(order: OrderLine) {
    this.orderLines.push(order);
    this.logger.info(this.orderLines.length);
    this.updateCart();
  }

  updateOrder(order: OrderLine) {
    this.orderLines.forEach(ol => {
      if (ol === order) {
        ol.requiedAuxilaries = order.requiedAuxilaries;
        this.updateCart();
      }
    });
  }

  increase(o , p) {
    this.orderLines.forEach((ol , i) => {
      if (ol === o) {
        if (this.orderLines[i].quantity < this.MAX_ORDERS) {
          this.orderLines[i].quantity++;
          this.updateCart();
        } else {
          alert('Order is limited to ' + this.MAX_ORDERS + ' items');
        }
      }
    });
  }

  decrease(o , p) {
    this.orderLines.forEach((ol , i) => {
      if (ol === o) {
        if (this.orderLines[i].quantity > 1) {
          this.orderLines[i].quantity--;
        }
      }
    });
    this.updateCart();
  }

  increaseAuxilary(auxilaryItem: AuxilaryLineItem, orderLine: OrderLine) {

    this.orderLines.forEach( ol => {
      if (ol === orderLine) {
        this.logger.info('Tytystytsytsytsyt ' , ol === orderLine);
        ol.requiedAuxilaries.forEach( al => {
          if (auxilaryItem.id === al.productId) {
            al.quantity++;
            console.error('OrderLine ' , ol);
          }
        });
      }
    });
    this.updateCart();
  }

  decreaseAuxilary(auxilaryItem , orderLine) {
    this.orderLines.forEach( ol => {
      if (ol === orderLine) {
        ol.requiedAuxilaries.forEach( al => {
          if (auxilaryItem.id === al.productId) {
            if (al.quantity > 1) {
              al.quantity--;
            }
          }
        });
      }
    });
    this.updateCart();
  }

  removeAuxilary(auxilaryItem , orderLine) {
    this.orderLines.forEach( ol => {
      if (ol === orderLine) {
        ol.requiedAuxilaries = ol.requiedAuxilaries.filter(aux => aux.productId !== auxilaryItem.id);
      }
    });
    this.updateCart();
  }

}
