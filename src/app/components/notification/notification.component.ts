import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Notification, NotificationDTO } from 'src/app/api/models';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { DatePipe } from '@angular/common';
import { LogService } from 'src/app/services/log.service';
import { CommandResourceService } from 'src/app/api/services';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {

  user;
  notifications: Notification[] = [];
  showLoading;
  notificationSubscription;
  pageNumber = 0;
  stores = {};
  orders = {};

  notificationSorted = {
    'today': [],
    'yesterday': []
  }
  notificationSortedKeys = ['today', 'yesterday'];

  @ViewChild(IonInfiniteScroll, null) inifinitScroll: IonInfiniteScroll;

  constructor(
    private modalController: ModalController,
    private queryResource: QueryResourceService,
    private logger: LogService,
    private storage: Storage,
    private util: Util,
    private datePipe: DatePipe,
    private commandResourceService: CommandResourceService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.showLoading = true;
    this.getUser();
  }


  getUser() {
    this.storage.get('user')
      .then(data => {
        this.user = data;
        this.getNotifications(this.pageNumber, null);
      });
  }

  getNotifications(i, event) {
    this.notificationSubscription = this.queryResource.findNotificationByReceiverIdUsingGETResponse(
      {
        receiverId: this.user.preferred_username,
        page: i
      }
    ).subscribe(notifcatons => {
      notifcatons.body.content.forEach(n => {
        this.getOrder(n.targetId);
        this.sortNotifications(n);
      });
      this.showLoading = false;
      if (i !== 0) {
        event.target.complete();
      }
      if (i === notifcatons.body.totalPages) {
        this.logger.info(this, 'Toggle disabled');
        this.toggleInfiniteScroll();
        this.notificationSortedKeys.forEach(key => {
          console.warn(key);
          console.error(this.notificationSorted[key]);
        })
      }
    },
      err => {
        this.logger.info(this, err);
        this.util.createToast('Unable to get Notifications');
        this.showLoading = false;
      });
  }

  getOrder(id) {
    this.queryResource.findOrderByOrderIdUsingGET(id)
      .subscribe(order => {
        this.orders[id] = order;
        this.getStore(order.storeId);
      },
        err => {
          this.logger.info(this, 'Unable To Fetch Order');
        });
  }

  getStore(id) {
    if (this.stores[id] === undefined) {
      this.stores[id] = {};
      this.queryResource.findStoreByRegisterNumberUsingGET(id)
        .subscribe(store => {
          this.stores[id] = store;
        }, err => {
          console.log('Error occured while fetching storeByRegisterNumber');
        });
    }
  }


  sortNotifications(n: Notification) {
    const date1: any = new Date(this.datePipe.transform(n.date, 'M/d/yy'))
    const date2: any = new Date(this.datePipe.transform(new Date(), 'M/d/yy'));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      this.notificationSorted['today'].push(n);
    } else if (diffDays === 1) {
      this.notificationSorted['yesterday'].push(n);
    } else {
      if (this.notificationSortedKeys.includes(this.datePipe.transform(n.date, 'M/d/yy'))) {
        this.notificationSorted[this.datePipe.transform(n.date, 'M/d/yy')].push(n);
      } else {
        this.notificationSortedKeys.push(this.datePipe.transform(n.date, 'M/d/yy'));
        this.notificationSorted[this.datePipe.transform(n.date, 'M/d/yy')] = [];
        this.notificationSorted[this.datePipe.transform(n.date, 'M/d/yy')].push(n);
      }
    }
  }

  readNotification(notification, nkey) {
 
    notification
    this.commandResourceService.updateNotificationUsingPUT(this.toNotificationDTO(notification))
      .subscribe(data => {
        this.notificationSorted[nkey].filter(n => {
          if (n.id === notification.id) {
            n.status = 'read';
          }
        });
        this.notificationService.getNotificationCount(this.user.preferred_username);
      })
  }

  dismiss() {
    this.modalController.dismiss();
  }

  loadMoreData(event) {
    ++this.pageNumber;
    this.logger.info('Loading More Orders Page ', this.pageNumber);
    this.getNotifications(this.pageNumber, event);
  }

  async refresh(event) {
    this.pageNumber = 0;
    this.notifications = [];
    this.notificationSorted = {
      'today': [],
      'yesterday': []
    };
    this.notificationSortedKeys = ['today', 'yesterday']
    this.logger.info('Dorefresh is working');
    await this.getUser();
    event.target.complete();
  }

  toggleInfiniteScroll() {
    this.inifinitScroll.disabled = !this.inifinitScroll.disabled;
  }

  toNotificationDTO(notification: Notification): NotificationDTO {
    return {
      date: notification.date,
      id: notification.id,
      image: notification.image,
      imageContentType: notification.imageContentType,
      message: notification.message,
      receiverId: notification.receiverId,
      status: 'read',
      targetId: notification.targetId,
      title: notification.title,
      type: notification.type
    }
  }

  ngOnDestroy() {
    if (this.notificationSubscription !== undefined) {
      this.notificationSubscription.unsubscribe();
    }
  }

}
