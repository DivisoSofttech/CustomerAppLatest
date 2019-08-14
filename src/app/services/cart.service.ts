import { Injectable } from '@angular/core';
import { Product, StockCurrent, OrderLine, Store } from '../api/models';
import { BehaviorSubject } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';

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
  
  
  constructor(private alertController: AlertController,
              private navController: NavController) {
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
            this.navController.navigateForward('/tabs/basket');
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

  add(product: Product) {
    this.orderLines.forEach(orderLine => {
      if (orderLine.productId === product.id) {
        orderLine.quantity++;
        orderLine.total += orderLine.pricePerUnit;
        this.updateCart();
      }
    });
  }

  decrease(product : Product) {
    this.orderLines.forEach(orderLine => {
      if (orderLine.productId === product.id) {
        if(orderLine.quantity > 1) {
          orderLine.quantity--;
          orderLine.total -= orderLine.pricePerUnit;
          this.updateCart();  
        }
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

  updateCart() {
    this.totalPrice = 0;
    this.orderLines.forEach(order => {
      this.totalPrice += order.total;
    });
    this.observableTickets.next(this.orderLines);
    this.observablePrice.next(this.totalPrice);
  }

  emptyCart() {
    this.orderLines = [];
    this.currentShopId = 0;
    this.currentShop = undefined;
    this.updateCart();
  }

  getTotalQunatity() {


  }
}
