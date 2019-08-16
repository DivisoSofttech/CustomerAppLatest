import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';
import { RouteService } from 'src/app/services/route.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit , OnDestroy {

  @Output() filter = new EventEmitter();

  currentRoute;

  orderCount  = 0;

  routeSubscription;

  constructor(
    private navController: NavController,
    private logger: NGXLogger,
    private route: RouteService,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.cart.observableTickets
    .subscribe(data => {
      this.orderCount = data.length;
    });
    this.getCurrentRoute();
  }

  goTo(url) {
    this.navController.navigateForward(url);
  }

  getCurrentRoute() {
    this.routeSubscription = this.route.getRouteSubscription()
    .subscribe(data => {
      this.currentRoute = data;
      console.warn(this.currentRoute);
    })
  }

  emitFilterClick() {
    this.filter.emit('');
  }

  ngOnDestroy() {
    console.log('destroy');
    this.routeSubscription.unsubscribe();
  }

}
