import { ModalDisplayUtilService } from './../../services/modal-display-util.service';
import { MakePaymentComponent } from 'src/app/components/make-payment/make-payment.component';
import { Component, OnInit } from '@angular/core';
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from '@ionic-native/paypal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OrderService } from 'src/app/services/order.service';
import { Platform, ModalController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';

@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.scss'],
})
export class PaypalPaymentComponent implements OnInit {

  constructor(private iab: InAppBrowser,
              private payPal: PayPal,
              private orderService: OrderService,
              private platform: Platform,
              private util: Util,
              private modalController: ModalController,
              private displayModalService: ModalDisplayUtilService

    ) { }


  payWithPaypalSDK() {
    console.log('In Paypal payment');
    this.payPal
      .init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox:
          'AQ1oQup1GH_ihZOolhFZX2f_hdsD1K-t5MJ99of_6390pyaB7b-aO33GxUqqe2kz7G4EkNitDXoCN2it'
      })
      .then(
        () => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal
            .prepareToRender(
              'PayPalEnvironmentSandbox',
              new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
              })
            )
            .then(
              () => {
                console.log('In paypal payment 1');
                const payment = new PayPalPayment(
                  this.orderService.order.grandTotal + '',
                  'EUR',
                  'Foodexp Purchase',
                  'sale'
                );
                this.payPal.renderSinglePaymentUI(payment).then(
                  res => {
                    // Successfully paid

                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SpayWithPaypalDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                    console.log('Paypal payment id is ' + res.response.id);
                    this.util.createCustomLoader('lines', 'Payment processing').then(loader => {
                    loader.present();
                    this.orderService.processPayment(res.response.id, 'success', 'paypal')
                    .subscribe(resource => {
                      this.orderService.resource = resource;
                      this.displayModalService.presentPaymentSuccessfullInfo();
                      loader.dismiss();
                    }, (err) => {
                      loader.dismiss();
                      this.util.createToast('Something went wrong try again', 'information-circle-outline');
                      this.displayModalService.navigateToBasket();
                    });
                  });
                  },
                  () => {
                    console.log(
                      'Error or render dialog closed without being successful'
                    );
                    this.displayModalService.presentMakePayment();
                    this.util.createToast('Payment failed please try again', 'information-circle-outline');
                    // Error or render dialog closed without being successful
                  }
                );
              },
              () => {
                console.log('Error in configuration');
                this.displayModalService.presentMakePayment();
                this.util.createToast('Payment failed please try again', 'information-circle-outline');
                // Error in configuration
              }
            );
        },
        () => {
          console.log('OnRejectionPaypal&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                    console.log(
            'Error in initialization, maybe PayPal isn\'t supported or something else'
          );
          this.modalController.getTop().then(modal => {
            console.log('Getting the top overlay');
            
            modal.dismiss();
          });
          // Error in initialization, maybe PayPal isn't supported or something else
          this.displayModalService.presentMakePayment();
          this.util.createToast('Payment failed please try again', 'information-circle-outline');

        }
      );

  }

  payWithPaypal() {
    this.util.createLoader().then( loader => {
      loader.present();
      this.orderService.initiatePaypalPayment().subscribe( paymentResponse => {
      loader.dismiss();
      paymentResponse.links.forEach( link => {
        if (link.rel === 'approval_url') {
         this.iab.create(link.href);
        }
      });
    });
  });
  }

  async presentPaymentSuccessfullInfo() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PaymentSuccessfullInfoComponent
    });
    return await modal.present();
  }
  async presentMakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }
  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      console.log('This is a browser routed paypalsdk android ios ');
      this.payWithPaypalSDK();

    } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
      console.log('This is a browser routed paypal ');
      this.payWithPaypal();
    }
  }

}
