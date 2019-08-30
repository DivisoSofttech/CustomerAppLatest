import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OpenTask, CommandResource } from 'src/app/api/models';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { ModalController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit , OnDestroy {
  @Input() task: OpenTask;

  store;

  order;

  orderSubscription;
  storesSubscription;

  constructor(
    private queryResource: QueryResourceService,
    private modalController: ModalController,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.getOrder();
  }

  continue() {
    if (this.task.taskName === 'Process Payment') {
      this.orderService.order = this.order;
      const resource: CommandResource = {
        nextTaskId: this.task.taskId,
        nextTaskName: this.task.taskName
      };
      this.orderService.resource = resource;
      this.presentmakePayment();
    } 
  }

  async presentmakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  getOrder() {
    this.orderSubscription = this.queryResource
      .findOrderByOrderIdUsingGET(this.task.orderId)
      .subscribe(data => {
        this.order = data;
        if (data !== null) {
          this.getStore();
        }
      });
  }

  getStore() {
    this.storesSubscription = this.queryResource
      .findStoreByRegisterNumberUsingGET(this.order.storeId)
      .subscribe(data => {
        this.store = data;
      });
  }

  ngOnDestroy() {
    if (this.orderSubscription !== undefined && this.storesSubscription !== undefined) {
    this.orderSubscription.unsubscribe();
    this.storesSubscription.unsubscribe();
    }
  }


}
