import { NGXLogger } from 'ngx-logger';
import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, ToastController, Platform } from '@ionic/angular';
import { ProcessPaymentComponent } from '../process-payment/process-payment.component';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements OnInit {

  paymentMethod;
  toBePaid;

  paymentOptions = [
    { name: 'Cash On Delivery', value: 'cod' , isChecked: false},
    // {name: 'Debit/Credit Cards', value: 'card'},
    { name: 'Credit/Debit Card', value: 'braintree' , isChecked: true}
  ];

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private logger: NGXLogger,
    private orderService: OrderService,
    private platform: Platform
  ) { }

  dismiss() {
    this.orderService.paymentMethod = this.paymentMethod;
    this.modalController.dismiss();
  }

  async presentModal() {
    this.dismiss();
    const modal = await this.modalController.create({
      component: ProcessPaymentComponent
    });
    return await modal.present();
  }

  ngOnInit() {
     if (this.orderService.paymentMethod === 'braintree') {
      this.paymentMethod = this.orderService.paymentMethod;
      this.paymentOptions = [];
      this.paymentOptions.push( { name: 'Cash On Delivery', value: 'cod' , isChecked: false});
      this.paymentOptions.push({ name: 'Credit/Debit Card', value: 'braintree' , isChecked: true});
    }
     this.toBePaid = this.orderService.order.grandTotal;
     if (this.platform.is('android') || this.platform.is('ios')) {
      this.logger.info(' android ios platform');
      this.paymentOptions.push({ name: 'Paypal Wallet/Card', value: 'paypal' , isChecked: false });
    } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
      console.log('This is a browser platform ');
      this.paymentOptions.push({name: 'Paypal Wallet', value: 'paypal', isChecked: false});
    }
  }

  returnToSale() {
    this.navController.navigateRoot('/tabs/home');
  }



}
