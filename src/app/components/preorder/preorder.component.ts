import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from 'src/app/api/models';
import { DatePipe } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { LogService } from 'src/app/services/log.service';
import * as moment from 'moment';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.component.html',
  styleUrls: ['./preorder.component.scss'],
})
export class PreorderComponent implements OnInit {

  fromTime;
  toTime;
  selectedTime;

  @Input() store: Store;

  hourArray = [];

  minuteArray = [];

  constructor(
    private popoverController: PopoverController,
    private logger: LogService,
    private cartService: CartService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.logger.info(this,'>>>>>>>>>>>FromTime',this.store.openingTime, ' toTime>>>>>>>>>>>',this.store.closingTime);

    let ftime = moment(this.store.openingTime);
    let ttime =  moment(this.store.closingTime);
  
    this.fromTime = ftime.format("hh:mm")
    this.toTime = ttime.format("hh:mm");
    this.logger.info(this,'From Time>>>>>',this.fromTime ,' toTime>>>>>>', this.toTime);
  }

  test() {
    console.error('sksjkjsk');
  }


  dismissTrue() {
    this.logger.info(this,'Selected Time in 12 Hours' , this.selectedTime);
    const tempDate = new Date('01/01/1970 ');
    this.logger.info(this,'Selected Time in Date Format' , tempDate);
    this.selectedTime = tempDate.toISOString();
    this.logger.info(this,'Selected Time in IsoString' , this.selectedTime);
    this.cartService.preOrderDate=this.selectedTime;
    this.popoverController.dismiss(true);
  }


  dismiss() {
    this.popoverController.dismiss();
  }

}
