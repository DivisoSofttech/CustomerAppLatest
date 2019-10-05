import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-payment-successfull-info',
  templateUrl: './payment-successfull-info.component.html',
  styleUrls: ['./payment-successfull-info.component.scss'],
})
export class PaymentSuccessfullInfoComponent implements OnInit {

  total;
  method;
  ref;

  order;

  constructor(private modalController: ModalController,
              private cartService: CartService,
              private navController: NavController,
              private orderService: OrderService,
              private logger: NGXLogger,
              private queryResource: QueryResourceService,
              private util: Util
              ) { }

  dismiss() {
    this.cartService.emptyCart();
    this.navController.navigateBack('/restaurant');
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.getOrder();
    this.total = Math.round(this.orderService.order.grandTotal);
    this.method = this.orderService.paymentMethod;
    this.ref = this.orderService.order.orderId;
    this.logger.info('Order in OrderService'  ,  this.orderService.order);
  }

  getOrder() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.queryResource.findOrderByOrderIdUsingGET(this.ref)
      .subscribe(data => {
        this.logger.info('Order is ' , data);
        this.order = data;
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      });
    });
  }

  async showOrderDetails() {

    if(this.order !== null) {
      const modal = await this.modalController.create({
        component: OrderDetailComponent,
        componentProps: {order: this.order , store: this.cartService.currentShop}
      });
      modal.present();
    } else {
      this.getOrder();
    }

  }

}
