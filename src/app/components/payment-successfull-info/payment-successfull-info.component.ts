import { NotificationService } from './../../services/notification.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { OrderService } from './../../services/order.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, NavController, IonButton } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { QueryResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { LogService } from 'src/app/services/log.service';

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

  currentShop;
  selectedOrder: any;

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private navController: NavController,
    private orderService: OrderService,
    private logger: LogService,
    private queryResource: QueryResourceService,
    private util: Util,
    private sharedData: SharedDataService,
    private notificationService: NotificationService,
  ) { }

  async continueShopping() {
    this.logger.info(this,'Closing the PaymentSuccessfullModal');
    this.cartService.emptyCart();
    this.orderService.resource = {};
    this.orderService.offer = undefined;
    this.orderService.deliveryInfo = {};
    this.sharedData.clearKeys('order');
    this.dismiss();
  }

  ngOnInit() {
    this.orderService.updateLoyaltyPoint();
    this.getRequiredDetails();
  }

  getRequiredDetails() {
    this.currentShop = this.cartService.currentShop;
    this.cartService.emptyCart();
    this.orderService.refresh();
    this.getOrder();
    this.total = this.orderService.order.grandTotal;
    this.method = this.orderService.paymentMethod;
    this.ref = this.orderService.order.orderId;
    this.logger.info(this,'Order in OrderService', this.orderService.order);
    this.sharedData.deleteData('checkout');
  }

  getOrder() {
    this.util.createLoader()
      .then(loader => {
        loader.present();
        this.queryResource.findOrderByOrderIdUsingGET(this.ref)
          .subscribe(data => {
            this.logger.info(this,'Order is ', data);
            this.order = data;
            loader.dismiss();
          },
            err => {
              loader.dismiss();
            });
      });
  }

  showOrderDetails() {
    if(this.currentShop) {
      this.selectedOrder = this.order;
    }
  }

  showPaymentSuccessFull() {
    this.selectedOrder = undefined;
  }



  dismiss() {
    this.modalController.dismiss();
    this.goHome();
  }

  goHome() {
    this.navController.navigateRoot('/');
  }

  ngOnDestroy(): void {
    this.logger.info('PaymentSuccessFull Destroyed');
  }

}
