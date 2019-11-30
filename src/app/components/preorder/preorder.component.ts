import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.component.html',
  styleUrls: ['./preorder.component.scss'],
})
export class PreorderComponent implements OnInit {

  fromTime;
  toTime;
  date = new Date();
  datefrom = new Date();
  fromnew;
  tonew;
  @Input() store: Store;

  constructor(
    private popoverController: PopoverController,
    private logger: NGXLogger,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.logger.info('>>>>>>>>>>>FromTime', this.store.preOrderSettings.fromTime, ' toTime>>>>>>>>>>>', this.store.preOrderSettings.toTime);
    this.fromTime = new Date(this.store.preOrderSettings.fromTime).toISOString();
    this.toTime = new Date(this.store.preOrderSettings.toTime).toISOString();
    // this.logger.info('From Time>>>>>', this.fromTime , ' toTime>>>>>>', this.toTime);
    // this.logger.info('Normal ISO format is ', new Date().toISOString());
    // this.logger.info('Hours is ' , new Date(this.store.preOrderSettings.fromTime).getTime());
    // this.logger.info('The time is from ', new Date(this.datePipe.transform(this.store.preOrderSettings.fromTime, 'medium')).toISOString());
    // this.logger.info('The time from last ', this.datePipe.transform(this.fromTime, 'short'));
    // this.logger.info('The time from last ', this.datePipe.transform(this.toTime, 'short'));
    // this.logger.info('from time hours to ', new Date(this.datePipe.transform(this.toTime, 'short')).getHours());
    // this.logger.info('from time hours to ', new Date(this.datePipe.transform(this.toTime, 'short')).getMinutes());
    // this.date.setHours(new Date(this.datePipe.transform(this.toTime, 'short')).getHours());
    // this.date.setMinutes(new Date(this.datePipe.transform(this.toTime, 'short')).getMinutes());
    // this.logger.info('Creating new date ', this.date);
    // this.logger.info('Iso format of created date ', this.date.toISOString());
    // this.tonew = this.date.toISOString();


    // this.logger.info('from time hours to from', new Date(this.datePipe.transform(this.fromTime, 'short')).getHours());
    // this.logger.info('from time hours to  from', new Date(this.datePipe.transform(this.fromTime, 'short')).getMinutes());
    // this.datefrom.setHours(new Date(this.datePipe.transform(this.fromTime, 'short')).getHours());
    // this.datefrom.setMinutes(new Date(this.datePipe.transform(this.fromTime, 'short')).getMinutes());
    // this.logger.info('Creating new date from new', this.datefrom);
    // this.logger.info('Iso format of created date ', this.datefrom.toISOString());
    // this.fromnew = this.datefrom.toISOString();

  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
