import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  currentRoute;

  orderCount  = 0;

  constructor(
    private navController: NavController,
    private route: Router,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.cart.observableTickets
    .subscribe(data => {
      this.orderCount=data.length;
    });
  }

  goTo(url) {
    this.navController.navigateForward(url);
    this.currentRoute = this.route.url.split('/',this.route.url.length)[1];
    console.log(this.currentRoute);
  }

  emitFilterClick() {
    this.filter.emit('');
  }

}
