import { Component, OnInit, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { PaymentNavService } from 'src/app/services/payment-nav.service';

@Component({
  selector: 'app-paymentflow-nav',
  templateUrl: './paymentflow-nav.component.html',
  styleUrls: ['./paymentflow-nav.component.scss'],
})
export class PaymentflowNavComponent implements OnInit {

  @ViewChild(IonNav,null) nav: IonNav;

  constructor(
    private paymentNavService: PaymentNavService
  ) { }

  ngOnInit() {
    this.paymentNavService.setIonNav(this.nav);
    this.nav.insert(0,MakePaymentComponent,{nav: this.nav});
    this.nav.setRoot(MakePaymentComponent);
  }

}
