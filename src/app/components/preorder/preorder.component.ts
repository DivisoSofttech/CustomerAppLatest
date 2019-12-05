import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { DatePipe } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
import { CartService } from 'src/app/services/cart.service';
import { LogService } from 'src/app/services/log.service';

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

  constructor(
    private popoverController: PopoverController,
    private logger: LogService,
    private cartService: CartService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.logger.info(this,'>>>>>>>>>>>FromTime',this.store.openingTime, ' toTime>>>>>>>>>>>',this.store.closingTime);
    this.fromTime = this.datePipe.transform(new Date(this.store.openingTime),'shortTime');
    this.toTime = this.datePipe.transform(new Date(this.store.closingTime),'shortTime');
    this.logger.info(this,'From Time>>>>>',this.fromTime ,' toTime>>>>>>', this.toTime);
  }


  dismissTrue() {
    this.logger.info(this,'Selected Time in 12 Hours' , this.selectedTime);
    const tempDate = new Date('01/01/1970 ' + this.convert12to24(this.selectedTime));
    this.logger.info(this,'Selected Time in Date Format' , tempDate);
    this.selectedTime = tempDate.toISOString();
    this.logger.info(this,'Selected Time in IsoString' , this.selectedTime);
    this.cartService.preOrderDate=this.selectedTime;
    this.popoverController.dismiss(true);
  }

  convert12to24(time12h){
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
