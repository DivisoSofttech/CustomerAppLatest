import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-phone-number-verfication',
  templateUrl: './phone-number-verfication.component.html',
  styleUrls: ['./phone-number-verfication.component.scss'],
})
export class PhoneNumberVerficationComponent implements OnInit {

  @Input() number;

  expire = '5:00';

  @ViewChild('timer' , null) timer;

  constructor(
    private modalController: ModalController,
    private util: Util
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  resend() {
    this.timer.restart();
  }

  timerEvent(event) {
    console.log(event);
  }

}
