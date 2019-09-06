import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';

import { Util } from 'src/app/services/util';
import { ModalController, NavController } from '@ionic/angular';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';



@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.scss']
})
export class ProcessPaymentComponent implements OnInit {

  paymentId: string;
  provider: string;
  constructor(
    private orderService: OrderService,
    private util: Util,
    private modalController: ModalController,
    private navController: NavController
    ) {}




  ngOnInit() {

    if (this.orderService.paymentMethod === 'paypal') {
      console.log('Paypal Method');
      this.provider = 'paypal';
    } else if (this.orderService.paymentMethod === 'cod') {
      console.log('Cash on elivery option ');
      this.util.createCustomLoader('lines', 'Payment processing').then(loader => {
      loader.present();
      this.orderService.processPayment('pay-cod', 'success', 'cod')
        .subscribe(resource => {
          this.orderService.resource = resource;
          this.presentPaymentSuccessfullInfo();
          loader.dismiss();
        }, (err) => {
          console.log('Error occured cod payment');
          loader.dismiss();
          this.util.createToast('Something went wrong try again', 'information-circle-outline');
          this.navigateToBasket();
        });
      });
    } else if (this.orderService.paymentMethod === 'card') {
      console.log('Razorpay payment ');
      this.provider = 'razorpay';
    } else if (this.orderService.paymentMethod === 'braintree') {
      console.log('Payment method is Braintree ');
      this.provider = 'braintree';
    }
  }

  navigateToBasket() {
    this.navController.navigateForward('basket');
  }
  async presentPaymentSuccessfullInfo() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PaymentSuccessfullInfoComponent
    });
    return await modal.present();
  }
}
