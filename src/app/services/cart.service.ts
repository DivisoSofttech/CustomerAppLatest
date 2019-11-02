import { Injectable, OnDestroy } from '@angular/core';
import { Product, StockCurrent, OrderLine, Store, AuxilaryLineItem } from '../api/models';
import { BehaviorSubject } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { QueryResourceService } from '../api/services';
import { Util } from './util';
import { NGXLogger } from 'ngx-logger';
import { SharedDataService } from './shared-data.service';
import { OrderService } from './order.service';
import { DecimalPipe } from '@angular/common';

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
  behaviourDeliveryTypes = new BehaviorSubject<any>(this.currentDeliveryTypes);
  behaviourStore = new BehaviorSubject<Store>(this.currentShop);

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private queryResource: QueryResourceService,
    private util: Util,
    private logger: NGXLogger,
    private sharedData: SharedDataService,
    private decimalPipe: DecimalPipe
  ) {
    this.observableTickets = new BehaviorSubject<OrderLine[]>(this.orderLines);
    this.observablePrice = new BehaviorSubject<number>(this.totalPrice);
    this.logger.info('Cart Service Created');
    if (this.currentShopId === 0) {
      this.getCartDetailsFromSharedMemory();
    }
    this.behaviourStore.subscribe(data => {
    });
  }

  saveCartDetailsToSharedMemory() {
    this.observableTickets.subscribe(data => {
      if (data !== undefined && data !== null) {
        if (data.length !== 0) {
          this.sharedData.saveToStorage('cart', {
            storeId: this.storeId,
            orderLines: this.orderLines,
            currentShop: this.currentShop,
            currentShopId: this.currentShopId,
            currentShopSetting: this.currentShopSetting,
            auxilaryItems: this.auxilaryItems,
            currentDeliveryTypes: this.currentDeliveryTypes
          });
        }
      }
    });
  }

  getCartDetailsFromSharedMemory() {
    this.sharedData.getData('cart')
      .then(data => {
        if (data !== undefined && data !== null) {
          if (data.orderLines.length !== 0) {
            this.storeId = data.storeId,
              this.orderLines = data.orderLines;
            this.currentShop = data.currentShop;
            this.currentShopId = data.currentShopId;
            this.currentShopSetting = data.currentShopSetting;
            this.currentDeliveryTypes = data.currentDeliveryTypes;
            this.auxilaryItems = data.auxilaryItems;
            this.behaviourDeliveryTypes.next(data.currentDeliveryTypes);
            this.updateCart();
          }
        }
      });
  }



  async presentRestaurantCheckout(details) {
    const alert = await this.alertController.create({
      header: 'Clear Cart',
      message: 'Are You sure',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (blah) => {
            this.emptyCart();
            if (details.product && details.stockCurrent && details.shop) {
              this.addProduct(details.product, details.stockCurrent, details.shop);
            } else if (details.actionSuccess) {
              details.actionSuccess();
            }
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
      this.saveCartDetailsToSharedMemory();
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
      this.saveCartDetailsToSharedMemory();

      return true;

    } else {
      this.presentRestaurantCheckout({
        product: product, stockCurrent: stockCurrent, shop: shop
      });
      return false;
    }
  }

  getStoreSettings() {
    if (this.currentShop !== undefined) {
      this.currentShopSetting = this.currentShop.storeSettings;
      this.getStoreDeliveryType();
    }
  }

  getStoreDeliveryType() {
    this.util.createLoader()
      .then(loader => {
        this.queryResource
          .findAllDeliveryTypesByStoreIdUsingGET({
            storeId: this.currentShopId
          })
          .subscribe(
            success => {
              loader.dismiss();
              this.logger.info('Got Store Delivery Types ', success.content);
              this.currentDeliveryTypes = success.content;
              this.behaviourDeliveryTypes.next(this.currentDeliveryTypes);
              this.sharedData.getData('cart')
                .then(data => {
                  if(data !== null) {
                  data.currentDeliveryTypes = success.content;
                  }
                  this.saveCartDetailsToSharedMemory();
                });
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
    // this.orderService.order.orderLines.splice(index, 1);
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
    this.orderLines.forEach(o => {
      o.total = parseFloat(this.decimalPipe.transform(o.total ,'1.2-2'));
    });
    this.observableTickets.next(this.orderLines);
    this.observablePrice.next(this.totalPrice);
  }

  emptyCart() {
    this.orderLines = [];
    this.currentShopId = 0;
    this.currentShop = undefined;
    this.sharedData.deleteData('cart');
    this.updateCart();
  }

  removeOrder(order: OrderLine) {
    console.warn('Previous Length', this.orderLines.length);
    this.orderLines = this.orderLines.filter(ol => ol !== order);
    console.warn('After Filter Length', this.orderLines.length);
    this.updateCart();
  }

  addAuxilary(p: Product, a: AuxilaryLineItem[]) {
    if (a !== undefined) {
      this.auxilaryItems[p.id] = a;
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

  increase(o, p) {
    this.orderLines.forEach((ol, i) => {
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

  decrease(o, p) {
    this.orderLines.forEach((ol, i) => {
      if (ol === o) {
        if (this.orderLines[i].quantity > 1) {
          this.orderLines[i].quantity--;
        }
      }
    });
    this.updateCart();
  }

  increaseAuxilary(auxilaryItem: AuxilaryLineItem, orderLine: OrderLine) {

    this.orderLines.forEach(ol => {
      if (ol === orderLine) {
        ol.requiedAuxilaries.forEach(al => {
          if (auxilaryItem.id === al.productId) {
            al.quantity++;
          }
        });
      }
    });
    this.updateCart();
  }

  decreaseAuxilary(auxilaryItem, orderLine) {
    this.orderLines.forEach(ol => {
      if (ol === orderLine) {
        ol.requiedAuxilaries.forEach(al => {
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

  removeAuxilary(auxilaryItem, orderLine) {
    this.orderLines.forEach(ol => {
      if (ol === orderLine) {
        ol.requiedAuxilaries = ol.requiedAuxilaries.filter(aux => aux.productId !== auxilaryItem.id);
      }
    });
    this.updateCart();
  }

}
