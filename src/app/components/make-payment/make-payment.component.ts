import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine } from 'src/app/api/models';
import { ModalController, NavController, ToastController, Platform } from '@ionic/angular';
import { ProcessPaymentComponent } from '../process-payment/process-payment.component';
import { PaymentCommandResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements OnInit {

  paymentMethod;
  toBePaid;

 paymentOptions = [
   {name: 'Cash On Delivery', value: 'cod'},
   {name: 'Debit/Credit Cards', value: 'card'}
 ];

constructor(
    private modalController: ModalController,
    private navController: NavController,
    private orderService: OrderService,
    private platform: Platform,
    private paymentService: PaymentCommandResourceService
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
    this.toBePaid = this.orderService.order.grandTotal;
    if (this.platform.is('android') || this.platform.is('ios')) {
      console.log(' android ios platform');
      this.paymentOptions.push({name: 'Paypal Wallet/Card', value: 'paypal'});
    } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
      console.log('This is a browser platform ');
      this.paymentOptions.push({name: 'Paypal Wallet', value: 'paypal'});
    }
  }

returnToSale() {
    this.navController.navigateRoot('/tabs/home');
  }



}
