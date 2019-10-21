import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {  Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform, NavController } from '@ionic/angular';
import { NotificationDTO } from '../api/models';
import { QueryResourceService } from '../api/services';


@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {

  notificationCount = 0;
  connectSubscription: Subscription;
  notificationListenSubscription: Subscription;
  notificationCountSubscription: Subscription;

  constructor(private socket: Socket,
              private localNotifications: LocalNotifications,
              private platform: Platform,
              private navCtrl: NavController,
              private queryResource: QueryResourceService) {
    this.socket.disconnect();
    this.onConnect().subscribe(data => {
      console.log('Socket has been connected successfully');
    });

  }

  connectToNotification() {
    console.log('Socket connected manually');
    this.socket.connect();
  }

  onConnect() {
     return this.socket.fromEvent('connect');
  }


  getNotificationCount(user) {
   this.notificationCountSubscription = this.queryResource.findNotificationCountByReceiverIdAndStatusNameUsingGET(
     {status: 'unread', receiverId: user})
    .subscribe(count => {
      console.log('Notification count unread is ', count);
      this.notificationCount = count;
    });
  }
  subscribeToMyNotifications(user) {
    console.log('Start listening to my notifications ', user);
    this.getNotificationCount(user);
    this.localNotifications.on('click').subscribe(event => {
      console.log('Notification clicked', event);
      this.navCtrl.navigateForward('restaurant');
    });
    return this.socket
         .fromEvent(user).subscribe((notification: NotificationDTO) => {
           this.notificationCount++;
           console.log('Notification count is ', this.notificationCount);
           console.log(notification);
           this.platform.ready().then(() => {
              this.localNotifications.schedule({
                title: notification.title,
                text: notification.message + '\nTracking ID is ' + notification.targetId,
                foreground: true,
                wakeup: true,
                lockscreen: true,
                sound: 'file://assets/sounds/plucky.mp3',
                icon: 'file://assets/images/logo.png'
              });
            });
        });
  }


  ngOnDestroy() {
    console.log('Ng ondestroy in notification service');
    this.notificationCountSubscription.unsubscribe();
  }

disconnectToMyNotifications() {
    console.log('Socket connection is disconnects');
    this.connectSubscription.unsubscribe();
    this.notificationListenSubscription.unsubscribe();
    this.socket.disconnect();
  }
}
