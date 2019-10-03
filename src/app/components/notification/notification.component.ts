import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OpenTask } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit  , OnDestroy {

  user;
  openTasks: OpenTask[] = [];
  showLoading;
  taskSubscription;

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
      this.getTasks();
    });
  }

  async doRefresh(event) {
    this.logger.info('Dorefresh is working');
    await this.getUser();
    event.target.complete();
  }
  getTasks() {
      this.taskSubscription = this.queryResource.getTasksUsingGET({
        assignee: this.user.preferred_username,
        name: 'Process Payment'
      }).subscribe(data => {
        this.showLoading = false;
        this.logger.info('Got Tasks ' , data);
        this.openTasks = data;
      },
      err => {
        console.log('Error occured getting accepted orders', err);
        this.showLoading = false;
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

}
