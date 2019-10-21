import { OrderService } from './../../services/order.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, NavController, IonButton } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  selector: 'app-payment-successfull-info',
  templateUrl: './payment-successfull-info.component.html',
  styleUrls: ['./payment-successfull-info.component.scss'],
})
export class PaymentSuccessfullInfoComponent implements OnInit , OnDestroy {

  total;
  method;
  ref;

  order;

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private navController: NavController,
    private orderService: OrderService,
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private util: Util
  ) { }

  async dismiss() {
    this.logger.info('Closing the PaymentSuccessfullModal');
    this.cartService.emptyCart();
    this.modalController.getTop()
    .then(data => {
      console.log(data);
      this.modalController.dismiss();
    })
    this.navController.navigateBack('/restaurant');
  }

  ngOnInit() {
    this.getOrder();
    this.total = this.orderService.order.grandTotal;
    this.method = this.orderService.paymentMethod;
    this.ref = this.orderService.order.orderId;
    this.logger.info('Order in OrderService', this.orderService.order);
  }

  ngOnDestroy(): void {
    this.logger.info('PaymentSuccessFull Destroyed');
  }

  getOrder() {
    this.util.createLoader()
      .then(loader => {
        loader.present();
        this.queryResource.findOrderByOrderIdUsingGET(this.ref)
          .subscribe(data => {
            this.logger.info('Order is ', data);
            this.order = data;
            loader.dismiss();
          },
            err => {
              loader.dismiss();
            });
      });
  }

  async showOrderDetails() {

    if (this.order !== null) {
     
      const modal = await this.modalController.create({
        component: OrderSummaryComponent,
        componentProps: { order: this.order, store: this.cartService.currentShop }
      });

      modal.onDidDismiss()
      .then((data)=> {
        this.logger.info('Modal Dismissed PaymentSuccessfull' , data);
        if(data.data) {
          this.dismiss();
        }
      })
      await modal.present();

    } else {
      this.getOrder();
    }

  }

}
