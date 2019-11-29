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

  @Input() store: Store;

  constructor(
    private popoverController: PopoverController,
    private logger: NGXLogger,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.logger.info('>>>>>>>>>>>FromTime',this.store.preOrderSettings.fromTime, ' toTime>>>>>>>>>>>',this.store.preOrderSettings.toTime);
    this.fromTime = this.datePipe.transform(new Date(this.store.preOrderSettings.fromTime), 'medium');
    this.toTime = this.datePipe.transform(new Date(this.store.preOrderSettings.toTime), 'medium');
    this.logger.info('From Time>>>>>',this.fromTime ,' toTime>>>>>>', this.toTime);
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
