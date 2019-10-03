import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {  Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform, NavController } from '@ionic/angular';
import { NotificationDTO } from '../api/models';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationCount = 0;
  connectSubscription: Subscription;
  notificationListenSubscription: Subscription;

  constructor(private socket: Socket,
              private localNotifications: LocalNotifications,
              private platform: Platform,
              private navCtrl: NavController) {
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

  subscribeToMyNotifications(user) {
    console.log('Start listening to my notifications ', user);
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
                sound: 'file://assets/beep.mp3',
                icon: 'file://assets/images/logo.png'
              });
            });
        });
  }

disconnectToMyNotifications() {
    console.log('Socket connection is disconnects');
    this.connectSubscription.unsubscribe();
    this.notificationListenSubscription.unsubscribe();
    this.socket.disconnect();
  }
}
