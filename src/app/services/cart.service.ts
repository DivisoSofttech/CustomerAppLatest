import { Injectable, OnDestroy } from '@angular/core';
import { Product, StockCurrent, OrderLine, Store, AuxilaryLineItem } from '../api/models';
import { BehaviorSubject } from 'rxjs';
import { AlertController} from '@ionic/angular';
import { QueryResourceService } from '../api/services';
import { Util } from './util';
import { SharedDataService } from './shared-data.service';
import { DecimalPipe } from '@angular/common';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  currentShopId = 0;
  orderLines: OrderLine[] = [];
  subTotal: any = 0.0;
  total = 0;
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
  preOrderDate;

  dataSaveTimer = null;
  
  constructor(
    private alertController: AlertController,
    private queryResource: QueryResourceService,
    private util: Util,
    private logger: LogService,
    private sharedData: SharedDataService,
    private decimalPipe: DecimalPipe
  ) {
    this.observableTickets = new BehaviorSubject<OrderLine[]>(this.orderLines);
    this.observablePrice = new BehaviorSubject<number>(this.subTotal);
    this.logger.info(this,'Cart Service Created');
    if (this.currentShopId === 0) {
      this.getCartDetailsFromSharedMemory();
    }
    this.behaviourStore.subscribe(data => {
    });
  }

  async saveCartDetailsToSharedMemory() {
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



  async presentRestaurantCheckout(clear) {
    const alert = await this.alertController.create({
      subHeader: 'Do You Wish To Clear The Cart?',
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
            clear();
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
      }
      this.updateCart();
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
              this.logger.info(this,'Got Store Delivery Types ', success.content);
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
      auxilaryTotal = 0;
      if (orderLine.requiedAuxilaries !== undefined) {
        orderLine.requiedAuxilaries.forEach(auxilaryOrderLine => {
          auxilaryOrderLine.total = auxilaryOrderLine.quantity * auxilaryOrderLine.pricePerUnit;
          auxilaryTotal += auxilaryOrderLine.total;
        });
      }
      orderLine.total = (orderLine.quantity * orderLine.pricePerUnit) + auxilaryTotal;
      orderTotal += orderLine.total;
    });
    this.subTotal = this.decimalPipe.transform(orderTotal, '1.2-2');
  }

  updateCart() {
    this.subTotal = 0;
    if (this.orderLines.length === 0) {
      this.currentShop = {
        imageLink:'',
        storeUniqueId:''
      };;
      this.currentShopId = 0;
    }
    this.calculatePrice();
    this.orderLines.forEach(o => {
      o.total = parseFloat(this.decimalPipe.transform(o.total , '1.2-2'));
    });
    this.observableTickets.next(this.orderLines);
    this.observablePrice.next(this.subTotal);
    
    if(!this.dataSaveTimer) {
      this.logger.info(this,'Setting Timer to Save Cart Details');
      this.dataSaveTimer = setTimeout(()=>{
        this.saveCartDetailsToSharedMemory();
        clearTimeout(this.dataSaveTimer);
        this.dataSaveTimer = null;
      },5000);
    }
  }

  emptyCart() {
    this.orderLines = [];
    this.currentShopId = 0;
    this.currentShop = undefined;
    this.preOrderDate = null;
    this.sharedData.deleteData('cart');
    this.updateCart();
  }

  removeOrder(order: OrderLine) {
    this.orderLines = this.orderLines.filter(ol => ol !== order);
    this.updateCart();
  }

  addAuxilary(p: Product, a: AuxilaryLineItem[]) {
    if (a !== undefined) {
      this.auxilaryItems[p.id] = a;
    }
  }

  addShop(shop) {

      this.currentShop = shop;
      this.currentShopId = shop.id;
      this.storeId = this.currentShop.regNo;
      this.getStoreSettings();
  }

  addOrder(order: OrderLine) {
    this.orderLines.push(order);
    this.logger.info(this,this.orderLines.length);
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
        this.orderLines[i].quantity++;
        this.updateCart();
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
