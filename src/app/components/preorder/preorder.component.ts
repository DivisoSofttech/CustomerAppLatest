import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';
import { DatePipe } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
import { CartService } from 'src/app/services/cart.service';

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
    private logger: NGXLogger,
    private cartService: CartService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.logger.info('>>>>>>>>>>>FromTime',this.store.preOrderSettings.fromTime, ' toTime>>>>>>>>>>>',this.store.preOrderSettings.toTime);
    this.fromTime = new Date(this.store.preOrderSettings.fromTime).toISOString();
    this.toTime = new Date(this.store.preOrderSettings.toTime).toISOString();
    this.logger.info('From Time>>>>>',this.fromTime ,' toTime>>>>>>', this.toTime);
  }


  dismissTrue() {
    this.cartService.preOrderDate=this.selectedTime;
    this.popoverController.dismiss(true);
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
