import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OpenTask, Notification } from 'src/app/api/models';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit  , OnDestroy {

  user;
  notifications: Notification[] = [];
  showLoading;
  notificationSubscription;
  pageNumber = 0;
  @ViewChild(IonInfiniteScroll, null) inifinitScroll: IonInfiniteScroll;

  constructor(
    private modalController: ModalController,
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private storage: Storage,
    private util: Util
  ) { }

  ngOnInit() {
    this.showLoading = true;
    this.getUser();
  }

  getUser() {
    this.storage.get('user')
    .then(data => {
      this.user = data;
      this.getNotifications(this.pageNumber , null);
    });
  }

  getNotifications(i , event) {
    this.notificationSubscription = this.queryResource.findNotificationByReceiverIdUsingGETResponse(
      {
        receiverId: this.user.preferred_username,
        page: i
      }
    ).subscribe(notifcatons => {
      this.logger.info('Notificatins ' , i , notifcatons.body.content);
      notifcatons.body.content.forEach(n => {
        this.notifications.push(n);
      });
      this.showLoading = false;
      if(i !== 0) {
        event.target.complete();
      }
      if (i ===notifcatons.body.totalPages) {
        this.logger.info('Toggle disabled');
        this.toggleInfiniteScroll();
      }
    } ,
    err => {
      this.logger.info(err);
      this.util.createToast('Unable to get Notifications');
      this.showLoading = false;
    });
  }

  
  dismiss() {
    this.modalController.dismiss();
  }

  loadMoreData(event) {
    ++this.pageNumber;
    this.logger.info('Loading More Orders Page ' , this.pageNumber);
    this.getNotifications(this.pageNumber, event);
  }

  async refresh(event) {
    this.logger.info('Dorefresh is working');
    await this.getUser();
    event.target.complete();
  }

  toggleInfiniteScroll() {
    this.inifinitScroll.disabled = !this.inifinitScroll.disabled;
  }

  ngOnDestroy() {
    if(this.notificationSubscription !== undefined) {
      this.notificationSubscription.unsubscribe();
    }
  }

}
