import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { LogService } from 'src/app/services/log.service';
import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';
import { Util } from 'src/app/services/util';
import { Platform } from '@ionic/angular';

declare var braintree;

@Component({
  selector: 'app-braintree-card-payment',
  templateUrl: './braintree-card-payment.component.html',
  styleUrls: ['./braintree-card-payment.component.scss'],
})
export class BraintreeCardPaymentComponent implements OnInit {


  @Output() dismissEvent = new EventEmitter();

  @Output() successEvent = new EventEmitter();

  token = '';

  options = {
    primaryDescription: "Your Item",
    amount: '0',
    currency: 'EUR'
  };

  instanceWeb;

  optionsWeb = {
    authorization: this.token,
    selector: '#dropin-container',
    paypal: { flow: 'vault' },
    amount:'0',
    currency: 'EUR'
  };
  hidePurchase: boolean;


  constructor(
    private orderService: OrderService,
    private logger: LogService,
    private braintreeNative: Braintree,
    private util: Util,
    private platform: Platform
  ) { }

  ngOnInit() {

    this.optionsWeb.amount = this.orderService.order.grandTotal.toString();
    this.options.amount = this.orderService.order.grandTotal.toString();

    if(this.platform.is('android' || 'ios')) {
      this.logger.info(this, 'Using Braintree Native');
      this.logger.info(this,'To Be Paid' , this.options.amount)
      this.createToken(()=> {
        this.initializeBrainTreePlugin();
      })
    } else {
      this.logger.info(this, 'Using Braintree Web');
      this.logger.info(this,'To Be Paid' , this.optionsWeb.amount);
      this.createToken(() => {
        this.createUiWeb();
      })  
    }
  }

  createToken(success) {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.orderService.createBraintreeClientAuthToken().subscribe(token => {
        this.token = token;
        loader.dismiss();
        success();
      },err=> {
        loader.dismiss();
        this.dismissEvent.emit();
      });  
    })
  }

  createUiWeb() {
    this.logger.info('SetUp Braintree Web');
    this.optionsWeb.authorization = this.token;
    braintree.dropin.create(this.optionsWeb, (err, instance) => {
      console.log('SetUp Finished');
      this.instanceWeb = instance;
    })
  }

  createUiNative() {
    return this.braintreeNative.presentDropInPaymentUI(this.options);
  }


  initializeBrainTreePlugin() {
    const _this = this;
    this.braintreeNative.initialize(this.token)
      .then(() => this.createUiNative())
      .then((result: PaymentUIResult) => {

        if (result.userCancelled) {
          console.log("User cancelled payment dialog.");
        } else {
          this.requestPayment(result.nonce);
        }
      })
      .catch((error: string) => console.error(error));
  }

  payWeb() {
    this.instanceWeb.requestPaymentMethod((err, payload)=>{
      this.requestPayment(payload);
    });
  }

  requestPayment(payload) {
    this.hidePurchase = true;
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.orderService.createBraintreeTransaction(payload)
      .subscribe(response => {
        this.logger.info(this,'Braintree Transaction Creation Successfull' , response);
        this.orderService.processPayment(response.transactionId, 'success', 'braintree')
          .subscribe(resource => {
            this.logger.info(this,'Braintree Payment Successfull' , resource);
            this.orderService.resource = resource;
            loader.dismiss();
            this.successEvent.emit();
          }, 
          (err) => {
            loader.dismiss();
            this.dismissEvent.emit();
          });
      }, (err) => {
        loader.dismiss();
        this.dismissEvent.emit();
      });

    })
  }








}
