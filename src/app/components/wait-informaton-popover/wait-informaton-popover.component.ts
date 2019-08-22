import { NavController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait-informaton-popover',
  templateUrl: './wait-informaton-popover.component.html',
  styleUrls: ['./wait-informaton-popover.component.scss'],
})
export class WaitInformatonPopoverComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  navigateToHome() {
    this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward('restaurant');
  }
}
