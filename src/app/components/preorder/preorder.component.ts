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

  openingTime;
  closingTime;
  selectedTime;

  @Input() isCollection = false;

  @Input() store: Store;

  closeTommorow = false;

  constructor(
    private popoverController: PopoverController,
    private logger: LogService,
    private cartService: CartService,
    private datePipe: DatePipe,
    private util: Util
  ) { }

  ngOnInit() {
    this.openingTime = moment(this.store.openingTime).format('hh:mm A');
    this.closingTime = moment(this.store.closingTime).format('hh:mm A')
    this.checkIfStoreClosesTommorow();
  }

  checkIfStoreClosesTommorow() {
    let openingDate = new Date(this.store.openingTime);
    let closingDate = new Date(this.store.closingTime);
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setHours(openingDate.getHours());
    fromDate.setMinutes(openingDate.getMinutes());
    toDate.setHours(closingDate.getHours());
    toDate.setMinutes(closingDate.getMinutes());
    let momentOpeningDate = moment(fromDate);
    let momentClosingDate = moment(toDate);
    if (momentClosingDate.isBefore(momentOpeningDate)) {
      this.logger.info(this, 'Adding one Day to closing date');
      this.closeTommorow = true;
      console.error(this.closeTommorow);
      toDate.setDate(toDate.getDate() + 1);
      momentClosingDate = moment(toDate);
    }
  }

  checkSelectedDate() {
    let openingDate = new Date(this.store.openingTime);
    let closingDate = new Date(this.store.closingTime);
    let selectedDate = new Date(this.selectedTime);
    let fromDate = new Date();
    let toDate = new Date();
    let sDate = new Date();

    fromDate.setHours(openingDate.getHours());
    fromDate.setMinutes(openingDate.getMinutes());
    toDate.setHours(closingDate.getHours());
    toDate.setMinutes(closingDate.getMinutes());
    sDate.setHours(selectedDate.getHours());
    sDate.setMinutes(selectedDate.getMinutes());

    let momentOpeningDate = moment(fromDate);
    let momentClosingDate = moment(toDate);
    let momentSelectedDate = moment(sDate);

    if (momentClosingDate.isBefore(momentOpeningDate)) {
      this.logger.info(this, 'Adding one Day to closing date');
      this.closeTommorow = true;
      toDate.setDate(toDate.getDate() + 1);
      momentClosingDate = moment(toDate);
      if (momentSelectedDate.isBefore(momentOpeningDate)) {
        sDate.setDate(sDate.getDate() + 1);
        momentSelectedDate = moment(sDate);
      }
    }
    if (momentSelectedDate.isBetween(momentOpeningDate, momentClosingDate)) {
      this.cartService.preOrderDate = momentSelectedDate.toISOString();
      this.popoverController.dismiss(true);
    } else {
      this.util.createToast('Select a Time Between ' + `${this.openingTime}` + ' to ' + `${this.closingTime}`)
    }
  }


  dismissTrue() {
    this.checkSelectedDate();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
