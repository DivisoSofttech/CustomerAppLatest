import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { LogService } from 'src/app/services/log.service';
import { Util } from 'src/app/services/util';
import { Platform } from '@ionic/angular';

declare var braintree;

@Component({
  selector: 'app-braintree-card-payment',
  templateUrl: './braintree-card-payment.component.html',
  styleUrls: ['./braintree-card-payment.component.scss'],
})
export class BraintreeCardPaymentComponent implements OnInit {


  showLoading = true;

  @Output() dismissEvent = new EventEmitter();

  @Output() successEvent = new EventEmitter();

  token = '';

  instanceWeb;

  grandTotal = '';

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
    private util: Util,
    private platform: Platform
  ) { }

  ngOnInit() {
   this.initBraintreeComponent();
  }

  initBraintreeComponent() {
    this.grandTotal = this.orderService.order.grandTotal.toString();
    this.optionsWeb.amount = this.orderService.order.grandTotal.toString();
    if(this.platform.is('android' || 'ios')) {
     delete this.optionsWeb.paypal
    }
    this.createToken(() => {
      this.createUiWeb();
    })  
  }

  createToken(success) {
      this.orderService.createBraintreeClientAuthToken().subscribe(token => {
        this.token = token;
        success();
      },err=> {
        this.showLoading = false;
        this.dismissEvent.emit();
      });  
  }

  createUiWeb() {
    this.logger.info('SetUp Braintree Web');
    this.optionsWeb.authorization = this.token;
    braintree.dropin.create(this.optionsWeb, (err, instance) => {
      this.showLoading = false;
      this.instanceWeb = instance;
    })
  }


  payWeb() {
    this.instanceWeb.requestPaymentMethod((err, payload)=>{
      this.logger.info(this,'Braintree Payload',payload)
      if(payload) {
        this.requestPayment(payload);
      } else {
        this.util.createToast('Fill in the card details');
      }
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
