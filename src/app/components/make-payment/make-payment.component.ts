import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit} from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { LogService } from 'src/app/services/log.service';
import { PaymentNavService } from 'src/app/services/payment-nav.service';
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
    { name: 'Cash On Delivery', value: 'cod' , isChecked: false, icon: 'cash'},
    {name: 'Debit/Credit Card', value: 'card', isChecked: false, icon: 'card'}
  ];

  constructor(
    private navController: NavController,
    private logger: LogService,
    private orderService: OrderService,
    private platform: Platform,
    private  modalController: ModalController,
    private paymentNavService: PaymentNavService
  ) { }

  ngOnInit() {
    this.getTotal();
    this.checkPlatform();
  }

  getTotal() {
    this.toBePaid = this.orderService.order.grandTotal;
  }

  checkPlatform() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.logger.info(this,'Paypal Supported [Android , IOS]');
      // this.paymentOptions.push({ name: 'Paypal Wallet/Card', value: 'paypal' , isChecked: false , icon: 'wallet'});
    } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
      this.logger.info(this,'Paypal not Supported [Browser, PWA]')
    }
  }

  navigateForward() {
    this.orderService.paymentMethod = this.paymentMethod;
    this.paymentNavService.navigateTo(ProcessPaymentComponent)
  }

  navigateBack() {
    this.modalController.dismiss()
  }

  returnToSale() {
    this.navController.navigateRoot('/tabs/home');
  }



}
