import { NavController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-wait-informaton-popover',
  templateUrl: './wait-informaton-popover.component.html',
  styleUrls: ['./wait-informaton-popover.component.scss'],
})
export class WaitInformatonPopoverComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private cartService: CartService,
  ) { }

  ngOnInit() {}

  navigateToHome() {
    this.popoverCtrl.dismiss();
    this.cartService.emptyCart();
    this.navCtrl.navigateForward('restaurant');
  }
}
