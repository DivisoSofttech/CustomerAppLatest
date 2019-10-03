import { Component, OnInit, Input } from '@angular/core';
import { NotificationDTO, Order, Notification } from 'src/app/api/models';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { ModalController } from '@ionic/angular';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {

  @Input() notification: Notification;

  order: Order;

  store;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.logger.info('Notifications' , this.notification);
  }

  getStore() {
    this.queryResource.findStoreByRegisterNumberUsingGET(this.order.storeId)
    .subscribe(store => {
      this.store = store;
    });
  }

  async showOrderDetails(porder) {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,
      componentProps: {order: porder , store: this.store}
    });

    modal.present();
  }


}
