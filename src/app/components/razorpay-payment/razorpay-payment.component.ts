import { ModalDisplayUtilService } from './../../services/modal-display-util.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';

declare var RazorpayCheckout;

@Component({
  selector: 'app-razorpay-payment',
  templateUrl: './razorpay-payment.component.html',
  styleUrls: ['./razorpay-payment.component.scss'],
})
export class RazorpayPaymentComponent implements OnInit {

  constructor(private orderService: OrderService,
              private util: Util,
              private displayModalService: ModalDisplayUtilService   ) { }

  payWithRazorPay() {
    const intNumber = Math.trunc(this.orderService.order.grandTotal);
    const fractNumber = this.orderService.order.grandTotal % 1;
    const amount = intNumber * 100 + Math.round(fractNumber);
    this.util.createLoader().then( loader => {
      loader.present();
      this.orderService.createOrderRazorPay()
        .subscribe(response => {
        loader.dismiss();
        console.log('Response is order id ' + response.id);
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
        const successCallback = function(success, that, displayService, self) {
          console.log('payment_id: ' + success.razorpay_payment_id);
          const orderId = success.razorpay_order_id;
          const signature = success.razorpay_signature;
          that.paymentId = success.razorpay_payment_id;
          self.util.createCustomLoader('lines', 'Payment processing').then(loader => {
          loader.present();
          that.processPayment(success.razorpay_payment_id, 'success', 'razorpay')
          .subscribe(resource => {
            that.resource = resource;
            displayService.presentPaymentSuccessfullInfo();
            loader.dismiss();
          }, (err) => {loader.dismiss(); displayService.navigateToBasket(); });
          console.log(
            'Payment id in callback function ' +
            that.paymentId );
        });
      };
        // tslint:disable-next-line: only-arrow-functions
        const cancelCallback = function(error) {
          // alert(error.description + ' (Error ' + error.code + ')');
          // this.presentMakePayment();
          // this.util.createToast('Payment failed please try again', 'information-circle-outline');
        };

        RazorpayCheckout.on('payment.success', success => {
          successCallback(success, this.orderService, this.displayModalService, this);
        });
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        RazorpayCheckout.open(options);
      });

    });
  }

  ngOnInit() {
    this.payWithRazorPay();
  }

}