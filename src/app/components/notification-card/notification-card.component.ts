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

  @Input() order: Order;

  @Input() store;

  showLoading = true;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(this.store && this.order) {
      this.showLoading = false;
    }
  }

 
  async showOrderDetails() {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,
      componentProps: {order: this.order , store: this.store , modalType: true}
    });

    modal.present();
  }


}
