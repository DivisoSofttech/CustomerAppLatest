import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine } from 'src/app/api/models';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ProcessPaymentComponent } from '../process-payment/process-payment.component';


@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
})
export class MakePaymentComponent implements OnInit {

  paymentMethod;
  toBePaid;
  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private orderService: OrderService
      ) { }

  dismiss() {
    this.orderService.paymentMethod = this.paymentMethod;
    this.modalController.dismiss();
  }

  async presentModal() {
    this.dismiss();
    const modal = await this.modalController.create({
      component: ProcessPaymentComponent
    });
    return await modal.present();
  }
  ngOnInit() {
    this.toBePaid = this.orderService.order.grandTotal;
  }

  returnToSale() {
    this.navController.navigateRoot('/tabs/home');
  }



}
