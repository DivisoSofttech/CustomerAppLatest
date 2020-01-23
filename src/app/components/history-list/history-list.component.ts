import { ModalController, IonInfiniteScroll, NavController, Platform } from '@ionic/angular';
import { MakePaymentComponent } from './../make-payment/make-payment.component';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OpenTask, CommandResource } from 'src/app/api/models';
import { OrderService } from 'src/app/services/order.service';
import { Util } from 'src/app/services/util';
import { LogService } from 'src/app/services/log.service';
import * as moment from 'moment';


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
  backButtonSubscription: any;

  constructor(
    private queryResource: QueryResourceService,
    private orderService: OrderService,
    private logger: LogService,
    private modalController: ModalController,
    private navController:NavController,
    private util: Util,
    private platform: Platform
      ) { }

  
  ngOnInit() {
    this.getOrders(0, 'event');
    this.backButtonHandler();
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe((event) => {
      console.log
      if(this.selectedOrder) {
        this.selectedOrder = undefined;
      } else {
        this.dismiss();
      }
    });
  }

  confirmOrder(order: Order) {
    this.logger.info(this,'Confirm order User is ' + this.orderService.user.preferred_username );
    this.logger.info(this,'Confirm the order ', order);
    this.orderService.setOrder(order);
    this.orderService.deliveryInfo = order.deliveryInfo;
    this.util.createLoader().then( loader => {
      loader.present();
      this.queryResource.getTasksUsingGET({name: 'Process Payment', assignee: this.orderService.user.preferred_username})
      .subscribe(result => {
      this.logger.info(this,'Approved Orders opentasks ', result);
      result.forEach( opentask => {
        if (opentask.orderId === order.orderId) {
          const resource: CommandResource = {
             nextTaskId: opentask.taskId,
             nextTaskName: opentask.taskName
          };
          this.orderService.resource = resource;
          this.logger.info(this,'Confirm order resource ', resource);
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
    this.logger.info(this,'Page ' , i);
    this.queryResource.findOrdersByCustIdUsingGET({
      customerId: this.keyCloakUser.preferred_username,
      page: i,
      size: 20,
      date: moment().format('YYYY-MM-DD'),
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
        this.logger.info(this,'Loading Page Completed ' , i);
        event.target.complete();
      }
      if (i === porders.totalPages) {
        this.logger.info(this,'Toggle disabled');
        this.toggleInfiniteScroll();
      }
      this.logger.info(this,'Total numbers of page ', porders.totalPages);
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
        this.logger.info(this,'Fetched Store' , store);
        this.stores[id] = store;
      });  
    }
  }

  toggleInfiniteScroll() {
    this.inifinitScroll.disabled = !this.inifinitScroll.disabled;
  }

  loadMoreData(event) {
    ++this.pageNumber;
    this.logger.info(this,'Loading More Orders Page ' , this.pageNumber);
    this.getOrders(this.pageNumber, event);
  }

  refresh(event) {
    this.pageNumber = 0;
    this.orders = [];
    this.showHistoryLoading = true;
    this.getOrders(0,event);
    event.target.complete();
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
    this.backButtonSubscription?this.backButtonSubscription.unsubscribe():null;
  }
}
