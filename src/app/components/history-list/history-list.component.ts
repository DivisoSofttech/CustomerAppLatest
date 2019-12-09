import { ModalController, IonInfiniteScroll, NavController } from '@ionic/angular';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
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
export class HistoryListComponent implements OnInit , OnDestroy {

  @Input() viewType = 'minimal';

  orders: Order[] = [];

  stores = {};

  showHistoryLoading = true;

  selectedOrder;

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

  showOrderDetails(order) {
    if(this.stores[order.storeId])
    this.selectedOrder = order;
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
        this.orders.push(o);
        if (this.stores[o.storeId] === undefined) {
          this.getStores(o.storeId);
        }     
      });
      if ( i !== 0 && event) {
        this.logger.info(this,'Loading Page ' , i);
        event.target.complete();
      }
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


  getStores(id) {
    if(this.stores[id] === undefined) {
      this.stores[id] = {};
      this.queryResource.findStoreByRegisterNumberUsingGET(id)
      .subscribe(store => {
        this.logger.info('Fetched Store' , store);
        this.stores[id] = store;
      });  
    }
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

  showList() {
    this.selectedOrder = undefined;
  }

  dismiss() {
    return this.modalController.dismiss();
  }

  navigateToBasket() {
    this.logger.info(this,'Navigating to basket');
    this.modalController.dismiss()
    .then(()=>{
      this.navController.navigateForward('/basket');
    })
  }

  ngOnDestroy(): void {
    this.logger.info(this,'Destroying HistoryList')
    
  }
}
