import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { LogService } from 'src/app/services/log.service';
import { Platform } from '@ionic/angular';
import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';

declare var braintree;

@Component({
  selector: 'app-braintree-card-payment',
  templateUrl: './braintree-card-payment.component.html',
  styleUrls: ['./braintree-card-payment.component.scss'],
})
export class BraintreeCardPaymentComponent implements OnInit {


  @Output() dismissEvent = new EventEmitter();

  token;

  showLoading = true;

  options = {
    amount: "49.99",
    primaryDescription: "Your Item",
    currency:'EUR'
  };


  constructor(
    private orderService: OrderService,
    private logger: LogService,
    private platform: Platform,
    private braintreeNative: Braintree
  ) { }

  ngOnInit() {
    // this.logger.info(this, 'Using Braintree Web');
    // this.createToken(() => {
    //   this.createUiWeb();
    // })  
    if(this.platform.is('android' || 'ios')) {
      this.logger.info(this, 'Using Braintree Native');
      this.createToken(()=> {
        this.initializeBrainTreePlugin();
      })
    } else {
      this.logger.info(this, 'Using Braintree Web');
      this.createToken(() => {
        this.createUiWeb();
      })  
    }
  }

  createToken(success) {
    this.orderService.createBraintreeClientAuthToken().subscribe(token => {
      this.token = token;
      success();
    });
  }

  createUiWeb() {
    var button = document.querySelector('#submit-button');
    braintree.dropin.create({
      authorization: this.token,
      selector: '#dropin-container',
      paypal: { flow: 'vault' },
    }, function (err, instance) {

      button.addEventListener('click', function () {
        instance.requestPaymentMethod(function (err, payload) {
          console.log('braintree payload ', payload);
        });
      })
    })
  }

  initializeBrainTreePlugin() {
    const _this = this;
    this.braintreeNative.initialize(this.token)
    .then(() => this.createUiNative())
    .then((result: PaymentUIResult) => {
      
    if (result.userCancelled) {
      console.log("User cancelled payment dialog.");
    } else {
      console.log("User successfully completed payment!");
      console.log("Payment Nonce: " + result.nonce);
      console.log("Payment Result.", result);
    }
  })
  .catch((error: string) => console.error(error));
    
  }

  createUiNative() {
    return this.braintreeNative.presentDropInPaymentUI(this.options);
  }






}
