import { ModalController, IonInfiniteScroll, NavController } from '@ionic/angular';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OpenTask, CommandResource } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';
import { OrderDetailComponent } from '../order-detail/order-detail.component';



@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {

  @Input() viewType = 'minimal';

  orders: Order[] = [];

  stores = {};

  showHistoryLoading = true;

  @Input() lineFlag = "full";
  @Input() keyCloakUser;
  @ViewChild(IonInfiniteScroll, null) inifinitScroll: IonInfiniteScroll;

  pageNumber = 0;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private orderService: OrderService,
    private modalController: ModalController,
    private navController:NavController,
    private util: Util
      ) { }

  ngOnInit() {
    this.getOrders(0, 'event');
  }

  confirmOrder(order: Order) {
    this.logger.info('Confirm order User is ' + this.orderService.customer.preferred_username );
    this.logger.info('Confirm the order ', order);
    this.orderService.setOrder(order);
    this.orderService.deliveryInfo = order.deliveryInfo;
    this.util.createLoader().then( loader => {
      loader.present();
      this.queryResource.getTasksUsingGET({name: 'Process Payment', assignee: this.orderService.customer.preferred_username})
      .subscribe(result => {
      this.logger.info('Approved Orders opentasks ', result);
      result.forEach( opentask => {
        if (opentask.orderId === order.orderId) {
          const resource: CommandResource = {
             nextTaskId: opentask.taskId,
             nextTaskName: opentask.taskName
          };
          this.orderService.resource = resource;
          this.logger.info('Confirm order resource ', resource);
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
    this.logger.info('Page ' , i);
    this.queryResource.findOrdersByCustomerIdUsingGET({
      customerId: this.keyCloakUser.preferred_username,
      page: i,
      size: 20,
      sort: ['desc']
    })
    .subscribe(porders => {
      this.showHistoryLoading = false;
      porders.content.forEach(o => {
        console.log('Order retreived is ', o);
        
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
        this.logger.info('Toggle disabled');
        this.toggleInfiniteScroll();
      }
      this.logger.info('Total numbers of page ', porders.totalPages);
    },
    err => {
      this.showHistoryLoading = false;
      this.logger.info('Error Getting Order Page ' + i , err);
    });
  }

  async showOrderDetails(porder) {
    if(this.stores[porder.storeId].name !== undefined) {
      const modal = await this.modalController.create({
        component: OrderDetailComponent,
        componentProps: {order: porder , store: this.stores[porder.storeId]}
      });
      
      modal.onDidDismiss()
      .then(data => {
        if(data.data) {
          // Fix to dismiss This modal
          this.modalController.getTop()
          .then(mod => {
            mod.dismiss();
            this.modalController.getTop()
            .then((mod2)=> {
              mod2.dismiss();
              this.navController.navigateForward('/basket');
            });
          })
        }
      });
      
      modal.present();  
    } else {

    }
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
    this.logger.info('Loading More Orders Page ' , this.pageNumber);
    this.getOrders(this.pageNumber, event);
  }

  refresh(event) {

  }

  async dismiss() {
    await this.modalController.getTop()
    .then(modal=> {
      modal.dismiss();
    });
  }
}
