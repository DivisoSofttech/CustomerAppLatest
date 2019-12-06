import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { LogService } from 'src/app/services/log.service';

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

  constructor(
    private orderService: OrderService,
    private logger: LogService
  ){}

  ngOnInit() {
      this.createToken(()=>{
        this.createUi();
      })
  }


  createUi() {
    var button = document.querySelector('#submit-button');
    const _this = this;
    braintree.dropin.create({
      authorization: this.token,
      selector: '#dropin-container',
      paypal: { flow: 'vault' },
      venmo: {}
    }, function (err, instance) {
      console.log('sjhsjsjh');
      _this.showLoading = false;
      button.addEventListener('click', function () {
        instance.requestPaymentMethod(function (err, payload) {
          _this.logger.info(this,'Paying with Brain tree ' , payload);
        });
      })
    })
  }

  createToken(success) {
    this.orderService.createBraintreeClientAuthToken().subscribe(token => {
      this.token = token;
      success();
    });
  }

}
