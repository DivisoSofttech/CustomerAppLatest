import { Util } from 'src/app/services/util';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import {
  PaymentCommandResourceService
} from 'src/app/api/services';
import {
  ModalController, Platform, NavController,
} from '@ionic/angular';
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from '@ionic-native/paypal/ngx';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';

declare var RazorpayCheckout;

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.scss']
})
export class ProcessPaymentComponent implements OnInit {

  paymentId: string;
  provider: string;
  constructor(
    private paymentCommandService: PaymentCommandResourceService,
    private modalCtrl: ModalController,
    private payPal: PayPal,
    private orderService: OrderService,
    private util: Util,
    private platform: Platform,
    private navCtrl: NavController  ) {}


  processPayment(ref: string, status: string) {
    console.log('Payment reference is ' + ref);
    this.util.createLoader().then( loader => {
      loader.present();
      this.paymentCommandService.processPaymentUsingPOST(
      {taskId: this.orderService.resource.nextTaskId,
      status, paymentDTO: {
        amount: this.orderService.order.grandTotal,
        payee: this.orderService.shop.regNo,
        payer: this.orderService.customer.preferred_username,
        paymentType: this.orderService.paymentMethod,
        provider: this.provider,
        status,
        targetId: this.orderService.order.orderId,
        total: this.orderService.order.grandTotal,
        ref
      }}
    ).subscribe( () => {
      loader.dismiss();
      this.presentModal();
    }, (error) => console.log('An error occured during processing payment ' + error));
  });
  }

  payWithRazorPay() {
    const intNumber = Math.trunc(this.orderService.order.grandTotal);
    const fractNumber = this.orderService.order.grandTotal % 1;
    const amount = intNumber * 100 + Math.round(fractNumber);
    this.util.createLoader().then( loader => {
      loader.present();
      this.paymentCommandService
      .createOrderUsingPOST({
        amount,
        currency: 'INR',
        payment_capture: 1,
        receipt: 'receipt12340'
      })
      .subscribe(response => {
        loader.dismiss();
        console.log('Response is orde id ' + response.id);
        const options = {
          description: 'Graeshoppe Payment',
          currency: 'INR',
          key: 'rzp_test_nYbfvOn43G0awI',
          order_id: response.id,
          amount,
          name: 'Graeshoppe',
          prefill: {
            email: 'pranav@razorpay.com',
            contact: '8879524924',
            name: 'Pranav Gupta',
            method: this.orderService.paymentMethod
          }
        };

        // tslint:disable-next-line: only-arrow-functions
        const successCallback = function(success, that) {
          console.log('payment_id: ' + success.razorpay_payment_id);
          const orderId = success.razorpay_order_id;
          const signature = success.razorpay_signature;
          that.paymentId = success.razorpay_payment_id;
          that.processPayment(success.razorpay_payment_id, 'success');
          console.log(
            'Payment id in callback function ' +
            that.paymentId );
        };

        // tslint:disable-next-line: only-arrow-functions
        const cancelCallback = function(error) {
          alert(error.description + ' (Error ' + error.code + ')');
        };

        RazorpayCheckout.on('payment.success', success => {
          successCallback(success, this);
        });
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        RazorpayCheckout.open(options);
      });

    });
  }

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
                  'Graeshoppe purchase',
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
                    this.processPayment(res.response.id, 'success');
                  },
                  () => {
                    console.log(
                      'Error or render dialog closed without being successful'
                    );

                    // Error or render dialog closed without being successful
                  }
                );
              },
              () => {
                console.log('Error in configuration');

                // Error in configuration
              }
            );
        },
        () => {
          console.log(
            'Error in initialization, maybe PayPal isn\'t supported or something else'
          );
          // Error in initialization, maybe PayPal isn't supported or something else
        }
      );

  }

  payWithPaypal() {
    this.util.createLoader().then( loader => {
      loader.present();
      this.paymentCommandService.initiatePaymentUsingPOST({
      intent: 'sale',
      payer: { payment_method: 'paypal'},
      transactions: [
        {
          amount: {
            total: this.orderService.order.grandTotal + '',
            currency: 'EUR',
            details: {}
          }
        }
      ],
      note_to_payer: 'Contact us for any queries',
      redirect_urls: {
        return_url: '',
        cancel_url: ''
      }
    }).subscribe( paymentResponse => {
      paymentResponse.links.forEach( link => {
        if (link.rel === 'approvalUrl') {
          this.navCtrl.navigateForward(link.href);
        }
      });
    });
  });
  }

  async presentModal() {
    this.dismiss();
    const modal = await this.modalCtrl.create({
      component: PaymentSuccessfullInfoComponent
    });

    return await modal.present();
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    console.log('Payment method is ' + this.orderService.paymentMethod);
    console.log('Amount is ' + this.orderService.order.grandTotal);
    console.log('Task id is ' + this.orderService.resource.nextTaskId);
    if (this.orderService.paymentMethod === 'paypal') {
      console.log('Paypal Method');
      if (this.platform.is('android') || this.platform.is('ios')) {
        console.log('This is a browser routed paypalsdk android ios ');
        this.payWithPaypalSDK();
      } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
        console.log('This is a browser routed paypal ');
        this.payWithPaypal();
      }
    } else if (this.orderService.paymentMethod === 'cod') {
      console.log('Cash on elivery option ');
      this.processPayment('pay-cod', 'success');
    } else {
      console.log('Razorpay payment ');
      this.payWithRazorPay();
    }
  }
}
