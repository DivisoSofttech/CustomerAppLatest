import { OrderService } from './../../services/order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Util } from 'src/app/services/util';
import { PaymentSuccessfullInfoComponent } from '../payment-successfull-info/payment-successfull-info.component';
import { Subscription } from 'rxjs';
import { LogService } from 'src/app/services/log.service';
import { PaymentNavService } from 'src/app/services/payment-nav.service';
import { NavController, Platform } from '@ionic/angular';
import { CommandResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.scss']
})
export class ProcessPaymentComponent implements OnInit, OnDestroy {


  codPaymentSubscription: Subscription;
  behaviouralSubjectSubscription: Subscription;

  paymentId: string;
  provider: string;
  loader;
  backButtonSubscription: any;

  constructor(
    private paymentNav: PaymentNavService,
    private orderService: OrderService,
    private commandResource: CommandResourceService,
    private util: Util,
    private logger: LogService,
    private navController: NavController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.startPayment();
  }

  startPayment() {
    switch (this.orderService.paymentMethod) {
      case 'paypal': this.setProvider('paypal'); break;
      case 'cod': this.initiateCashOnDelivery(); break;
      case 'card': this.setProvider('card'); break;
      default:break;
    }
  }

  setProvider(provider) {
    this.logger.info(this, 'Setting Payment Provider As', provider);
    this.provider = provider;
  }

  processPayment() {
    if (this.orderService.resource.nextTaskName === 'Process Payment') {
      this.codPaymentSubscription = this.orderService.processPayment('pay-cod', 'success', 'cod')
        .subscribe(resource => {
          console.log('process payment Subscribed');
          console.log('resource payment process is ', resource.nextTaskName);
          this.orderService.resource = resource;
          this.behaviouralSubjectSubscription.unsubscribe();
          this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
          this.navigateForward();
          this.loader.dismiss();
        }, (err) => {
          this.loader.dismiss();
          this.logger.error(this, 'Payment Failed Dismissing');
          this.behaviouralSubjectSubscription.unsubscribe();
          console.log('Error occured cod payment');
          this.util.createToast('Something went wrong try again', 'information-circle-outline');
          this.navigateBack();
        });
    } else {
      this.loader.present();
    }
  }

  initiateCashOnDelivery() {
    this.util.createCustomLoader('lines', 'Payment processing').then(loader => {
      this.loader = loader;
      loader.present();
      this.behaviouralSubjectSubscription = this.orderService.orderResourceBehaviour.subscribe(resources => {
        this.processPayment();
      },
        err => {
          this.logger.error(this, 'Payment Failed Dismissing');
          this.navigateBack();
        });
    })
  }

  navigateBack() {
    this.paymentNav.pop();
  }

  errorInPayment() {
    this.util.createToast('Error in Payment');
    this.navigateBack();
  }

  navigateForward() {
    this.commandResource.updateLoyaltyPointUsingPOST({
      point: 1,
      idpCode: this.orderService.user.preferred_username
    }).subscribe(data => {
      this.logger.info(this,'Loyality Point Success');      
    })
    this.navController.navigateForward('/restaurant');
    this.paymentNav.nav.setRoot(PaymentSuccessfullInfoComponent);
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe((event) => {
      this.loader.dismiss();
      this.navigateBack();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription? this.backButtonSubscription.unsubscribe():undefined;
    this.codPaymentSubscription ? this.codPaymentSubscription.unsubscribe() : undefined;
    this.behaviouralSubjectSubscription ? this.behaviouralSubjectSubscription.unsubscribe() : undefined
  }
}
