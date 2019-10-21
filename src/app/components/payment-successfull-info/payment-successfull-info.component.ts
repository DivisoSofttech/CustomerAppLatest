import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-payment-successfull-info',
  templateUrl: './payment-successfull-info.component.html',
  styleUrls: ['./payment-successfull-info.component.scss'],
})
export class PaymentSuccessfullInfoComponent implements OnInit {

  total;
  method;
  ref;

  constructor(private modalController: ModalController,
              private cartService: CartService,
              private navController: NavController,
              private orderService: OrderService
              ) { }

  dismiss() {
    this.cartService.emptyCart();
    this.navController.navigateBack('/restaurant');
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.total = Math.round(this.orderService.order.grandTotal);
    this.method = this.orderService.paymentMethod;
    this.ref = this.orderService.order.orderId;
  }

  // async showOrderDetails() {
  //   const modal = await this.modalController.create({
  //     componentProps: {order: this.orderService.order , store: this.cartService.currentShop}
  //   });

  //   modal.present();
  // }

}
