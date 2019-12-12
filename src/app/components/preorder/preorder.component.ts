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

    this.logger.info(this, '>>>>>>>>>>>FromTime', this.store.openingTime, ' toTime>>>>>>>>>>>', this.store.closingTime);

    let ftime = moment(this.store.openingTime);
    let ttime = moment(this.store.closingTime);

    this.fromTime = ftime.format("hh:mm")
    this.toTime = ttime.format("hh:mm");
    this.logger.info(this, 'From Time>>>>>', this.fromTime, ' toTime>>>>>>', this.toTime);
  }

  test() {
    console.error('sksjkjsk');
  }


  dismissTrue() {
    const tempTime = moment('2017-03-13 ' + this.convert12to24(this.selectedTime))
    this.logger.info(this,'Seleceted Time After Conversion' , tempTime.toDate());
    this.cartService.preOrderDate = tempTime.toDate().toISOString();
    this.popoverController.dismiss(true);
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
