import { ModalDisplayUtilService } from './../../services/modal-display-util.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';
import { SharedDataService } from 'src/app/services/shared-data.service';

declare var RazorpayCheckout;

@Component({
  selector: 'app-razorpay-payment',
  templateUrl: './razorpay-payment.component.html',
  styleUrls: ['./razorpay-payment.component.scss']
})
export class RazorpayPaymentComponent implements OnInit {
  
  @Output() dismissEvent = new EventEmitter();

  user: any;

  constructor(
    private orderService: OrderService,
    private util: Util,
    private displayModalService: ModalDisplayUtilService,
    private sharedDataService: SharedDataService
  ) {}

  payWithRazorPay() {
    this.util.createLoader().then(loader => {
      loader.present();
      this.orderService.createOrderRazorPay().subscribe(response => {
        loader.dismiss();
        console.log('Response is order id ' + response.id);
        const options = {
          description: 'Foodexp Payment',
          currency: 'EUR',
          key: 'rzp_test_ZR203rhDh9RWHf',
          order_id: response.id,
          amount: this.orderService.order.grandTotal * 100,
          name: 'Graeshoppe',
          prefill: {
            email: this.user.email,
            contact: '8879524924',
            name: this.user.preferred_username,
            method: this.orderService.paymentMethod
          }
        };

        // tslint:disable-next-line: only-arrow-functions
        const successCallback = function(success, that, displayService, self) {
          console.log('payment_id: ' + success.razorpay_payment_id);
          const orderId = success.razorpay_order_id;
          const signature = success.razorpay_signature;
          that.paymentId = success.razorpay_payment_id;
          self.util
            .createCustomLoader('lines', 'Payment processing')
            .then(paymentLoader => {
              paymentLoader.present();
              that
                .processPayment(
                  success.razorpay_payment_id,
                  'success',
                  'razorpay'
                )
                .subscribe(
                  resource => {
                    that.resource = resource;
                    displayService.presentPaymentSuccessfullInfo();
                    paymentLoader.dismiss();
                  },
                  err => {
                    this.dismissEvent.emit();
                    paymentLoader.dismiss();
                    displayService.navigateToBasket();
                  }
                );
              console.log('Payment id in callback function ' + that.paymentId);
            });
        };
        // tslint:disable-next-line: only-arrow-functions
        const cancelCallback = function(error) {
          this.dismissEvent.emit();
          // alert(error.description + ' (Error ' + error.code + ')');
          // this.presentMakePayment();
          // this.util.createToast('Payment failed please try again', 'information-circle-outline');
        };

        RazorpayCheckout.on('payment.success', success => {
          successCallback(
            success,
            this.orderService,
            this.displayModalService,
            this
          );
        });
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        RazorpayCheckout.open(options);
      });
    });
  }

  ngOnInit() {
    this.sharedDataService.getData('user').then(user => {
      this.user = user;
      console.log('User accessed from razorpay ', this.user);
    });
    this.payWithRazorPay();
  }
}
