import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OpenTask, CommandResource } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';



@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {

  orders: Order[] = [];

  stores = {};

  @Input() keyCloakUser;
  @ViewChild(IonInfiniteScroll, null) inifinitScroll: IonInfiniteScroll;

  pageNumber = 0;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private orderService: OrderService,
    private modalController: ModalController,
    private util: Util
      ) { }

  ngOnInit() {
    this.getOrders(0, 'event');
  }

  confirmOrder(order: Order) {
    console.log('Confirm order User is ' + this.orderService.customer.preferred_username );
    console.log('Confirm the order ', order);
    this.orderService.setOrder(order);
    this.orderService.deliveryInfo = order.deliveryInfo;
    this.util.createLoader().then( loader => {
      loader.present();
      this.queryResource.getTasksUsingGET({name: 'Process Payment', assignee: this.orderService.customer.preferred_username})
    .subscribe(result => {
      console.log('Approved Orders opentasks ', result);
      result.forEach( opentask => {
        if (opentask.orderId === order.orderId) {
          const resource: CommandResource = {
             nextTaskId: opentask.taskId,
             nextTaskName: opentask.taskName
          };
          this.orderService.resource = resource;
          console.log('Confirm order resource ', resource);
          loader.dismiss();
          this.presentmakePayment();
        }
          });
    });
  });
  }

  async presentmakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  getOrders(i, event) {
    console.log('Page ' , i);
    this.queryResource.findOrdersByCustomerIdUsingGET({
      customerId: this.keyCloakUser.preferred_username,
      page: i,
      size: 20
    })
    .subscribe(porders => {
      porders.content.forEach(o => {
        this.orders.push(o);
        if (this.stores[o.storeId] === undefined) {
          this.getStores(o.storeId);
        }
        if ( i !== 0) {
          event.target.complete();
        }
      });
      ++i;
      if (i === porders.totalPages) {
        console.log('Toggle disabled');
        this.toggleInfiniteScroll();
      }
      console.log('Total numbers of page ', porders.totalPages);
    },
    err => {
      console.log('Error Getting Order Page ' + i , err);
    });
  }

  getStores(id) {
    this.stores[id] = {};
    this.queryResource.findStoreByRegisterNumberUsingGET(id)
    .subscribe(store => {
      this.stores[id] = store;
    });
  }

  toggleInfiniteScroll() {
    this.inifinitScroll.disabled = !this.inifinitScroll.disabled;
  }

  loadMoreData(event) {
    ++this.pageNumber;
    console.log('Loading More Orders Page ' , this.pageNumber);
    this.getOrders(this.pageNumber, event);
  }

  refresh(event) {

  }

}
