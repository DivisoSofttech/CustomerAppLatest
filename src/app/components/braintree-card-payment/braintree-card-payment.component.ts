import { ModalDisplayUtilService } from './../../services/modal-display-util.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as braintree from 'braintree-web';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';

@Component({
  selector: 'app-braintree-card-payment',
  templateUrl: './braintree-card-payment.component.html',
  styleUrls: ['./braintree-card-payment.component.scss'],
})
export class BraintreeCardPaymentComponent implements OnInit {

  cardholdersName;
  hostedFieldsInstance: braintree.HostedFields;
  customerName;
  constructor(private orderService: OrderService,
              private util: Util,
              private modalController: ModalController,
              private displayModalService: ModalDisplayUtilService) { }

  createBraintreeUI() {
    this.util.createLoader().then(loader => {
    loader.present();
    this.orderService.createBraintreeClientAuthToken().subscribe(token => {
    console.log('Token from braintree is ', token);
    braintree.client.create({
      authorization: token
    }).then((clientInstance) => {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          // Override styles for the hosted fields
        },

        // The hosted fields that we will be using
        // NOTE : cardholder's name field is not available in the field options
        // and a separate input field has to be used incase you need it
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '1111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '111'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YY'
          }
        }
      }).then((hostedFieldsInstance) => {
        loader.dismiss();
        this.hostedFieldsInstance = hostedFieldsInstance;

        hostedFieldsInstance.on('focus', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field);
          label.classList.remove('filled'); // added and removed css classes
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('blur', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field); // fetched label to apply custom validations
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('empty', (event) => {
          const field = event.fields[event.emittedBy];
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('validityChange', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field);
          if (field.isPotentiallyValid) { // applying custom css and validations
            label.classList.remove('invalid');
          } else {
            label.classList.add('invalid');
          }
          // can add custom code for custom validations here
        });
      });
    });
  });
});
  }


  // Tokenize the collected details so that they can be sent to your server
  // called from the html when the 'Pay' button is clicked
  tokenizeUserDetails() {
    this.hostedFieldsInstance.tokenize({cardholderName: this.cardholdersName})
      .then(async (payload) => {
      console.log(payload);
      console.log('Grand total is ', Math.round(this.orderService.order.grandTotal));
      this.util.createCustomLoader('lines', 'Payment processing').then(loader => {
       loader.present();
       this.orderService.createBraintreeTransaction(payload)
        .subscribe(async response => {
        console.log('Response is ', response);
        await this.orderService.processPayment(response.transactionId, 'success', 'braintree')
        .subscribe(resource => {
          loader.dismiss();
          this.orderService.resource = resource;
          this.displayModalService.presentPaymentSuccessfullInfo();
        }, (err) => {
          loader.dismiss();
          this.util.createToast('Something went wrong try again', 'information-circle-outline');
          this.displayModalService.navigateToBasket();
        });
      }, (err) => {
        this.util.createToast('Something went wrong try again', 'information-circle-outline');
        this.displayModalService.navigateToBasket();
      });
    });
      // submit payload.nonce to the server from here
    }).catch((error) => {
      console.log(error);
      this.util.createToast('Payment failed please try again', 'information-circle-outline');
      // perform custom validation here or log errors
      this.displayModalService.navigateToBasket();
    });
  }
// Fetches the label element for the corresponding field
findLabel(field: braintree.HostedFieldsHostedFieldsFieldData) {
  return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
}



  ngOnInit() {
    this.createBraintreeUI();
  }

}
