import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from 'src/app/api/models';
import { DatePipe } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { LogService } from 'src/app/services/log.service';
import * as moment from 'moment';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.component.html',
  styleUrls: ['./preorder.component.scss'],
})
export class PreorderComponent implements OnInit {

  fromTime;
  toTime;
  selectedTime;

  @Input() isCollection = false;

  @Input() store: Store;

  hourArray = [];

  minuteArray = [];

  constructor(
    private popoverController: PopoverController,
    private logger: LogService,
    private cartService: CartService,
    private datePipe: DatePipe,
    private util: Util
  ) { }

  ngOnInit() {

    this.logger.info(this, '>>>>>>>>>>>FromTime', this.store.openingTime, ' toTime>>>>>>>>>>>', this.store.closingTime);

    let ftime = moment(this.store.openingTime);
    let ttime = moment(this.store.closingTime);

    this.fromTime = ftime.format("hh:mm a")
    this.toTime = ttime.format("hh:mm a");
    this.logger.info(this, 'From Time>>>>>', this.fromTime, ' toTime>>>>>>', this.toTime);
  }

  dismissTrue() {
    let ftime = moment(this.store.openingTime).format('hh:mm a');
    let ttime = moment(this.store.closingTime).format('hh:mm a');
    let stime = moment(this.selectedTime).format('hh:mm a');

    let fdate = moment('2019-12-12' + ' ' + ftime);
    let tdate = moment('2019-12-12' + ' ' + ttime);
    let sdate = moment('2019-12-12' + ' ' + stime);

    if (tdate.isBefore(fdate)) {
      this.logger.info(this, 'Adding One day to Closing Time')
      tdate = moment('2019-12-13' + ' ' + ttime);
      if (sdate.isBefore(fdate)) {
        this.logger.info(this, 'Adding One day to Selected Time')
        sdate = moment('2019-12-13' + ' ' + stime);
      }
    }

    this.selectedTime = stime;
    console.error(sdate.isAfter(fdate) , sdate.isBefore(tdate))

    if (sdate.isAfter(fdate) && sdate.isBefore(tdate)) {
      const tempTime = moment('2017-03-13 ' + stime);
      this.logger.info(this, 'Seleceted Time After Conversion', tempTime.toDate());
      this.cartService.preOrderDate = tempTime.toDate().toISOString();
      this.popoverController.dismiss(true);
    } else {
      this.util.createToast('Select a Time Betwee ' + `${this.fromTime}` + ' to ' + `${this.toTime}`)
    }

  }

  convert12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
