import { OrderService } from './../../services/order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Util } from 'src/app/services/util';
import { ModalController, NavController } from '@ionic/angular';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';
import { Subscription } from 'rxjs';
import { MakePaymentComponent } from '../make-payment/make-payment.component';



@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.scss']
})
export class ProcessPaymentComponent implements OnInit, OnDestroy {


  codPaymentSubscription: Subscription;
  behaviouralSubjectSubscription: Subscription;

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
        this.behaviouralSubjectSubscription = this.orderService.orderResourceBehaviour.subscribe(resources => {
        console.log('Subscription called');
        if (this.orderService.resource.nextTaskName === 'Process Payment') {

          this.codPaymentSubscription = this.orderService.processPayment('pay-cod', 'success', 'cod')
          .subscribe(resource => {
            console.log('process payment Subscribed');
            console.log('resource payment process is ', resource.nextTaskName);
            this.orderService.resource = resource;
            this.behaviouralSubjectSubscription.unsubscribe();
            this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
            this.presentPaymentSuccessfullInfo();
            loader.dismiss();
          }, (err) => {
             loader.dismiss();
             this.behaviouralSubjectSubscription.unsubscribe();
             console.log('Error occured cod payment');
             this.util.createToast('Something went wrong try again', 'information-circle-outline');
             this.navigateToBasket();
          });
        } else {
          loader.present();
        }
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

  async showMakePayment() {
    console.log('showmakepayment called');
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: MakePaymentComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }

  ngOnDestroy() {
    console.log('Ng destroy calls process payment');
    if (this.codPaymentSubscription !== undefined) {
      this.codPaymentSubscription.unsubscribe();
    }

    if (this.behaviouralSubjectSubscription !== undefined) {
      console.log('Ng destroy calls process payment behavioural sub');
      this.behaviouralSubjectSubscription.unsubscribe();
    }
  }
  navigateToBasket() {
    this.navController.navigateForward('basket');
  }
  
  async presentPaymentSuccessfullInfo() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PaymentSuccessfullInfoComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }
}
