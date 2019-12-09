import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BraintreeCardPaymentComponent } from './braintree-card-payment/braintree-card-payment.component';
import { PaypalPaymentComponent } from './paypal-payment/paypal-payment.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    BraintreeCardPaymentComponent,
    PaypalPaymentComponent,
  ],
  exports: [
    BraintreeCardPaymentComponent,
    PaypalPaymentComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class PaymentProvidersModule { }
