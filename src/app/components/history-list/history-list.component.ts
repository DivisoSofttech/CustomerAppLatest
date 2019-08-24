import { ModalController } from '@ionic/angular';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Component, OnInit, Input } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OpenTask, CommandResource } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {

  orders: Order[] = [];

  stores = {};
  approvedOrders: OpenTask[] = [];

  @Input() keyCloakUser;

  pageNumber = 0;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private orderService: OrderService,
    private modalController: ModalController
      ) { }

  ngOnInit() {
    this.getOrders(0);
    this.queryResource.getTasksUsingGET({name: 'Process Payment', assignee: this.orderService.customer.preferred_username})
      .subscribe(result => {
        this.approvedOrders = result;
      });
  }

  confirmOrder(order: Order) {
    this.orderService.setOrder(order);
    this.orderService.deliveryInfo = order.deliveryInfo;
    this.approvedOrders.forEach( opentask => {
     if (opentask.orderId === order.orderId) {
       const resource: CommandResource = {
          nextTaskId: opentask.taskId,
          nextTaskName: opentask.taskName
       };
       this.orderService.resource = resource;
     }
       });
  }

  async presentmakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  getOrders(i) {
    this.queryResource.findOrdersByCustomerIdUsingGET({
      customerId: this.keyCloakUser.preferred_username,
      page: i,
    })
    .subscribe(porders => {
      porders.content.forEach(o => {
        this.orders.push(o);
        if (this.stores[o.storeId] === undefined) {
          this.getStores(o.storeId);
        }
      });
      ++i;
      if (i === porders.totalPages) {
        this.toggleInfiniteScroll();
      }
    });
  }

  getStores(id) {
    this.stores[id] = {};
    this.queryResource.findStoreByRegisterNumberUsingGET(id)
    .subscribe(store => {
      this.logger.info('Store ' , store);
      this.stores[id] = store;
    });
  }

  toggleInfiniteScroll() {

  }

  loadMoreData(event) {
    ++this.pageNumber;
    this.getOrders(this.pageNumber);
  }

  refresh(event) {

  }

}
