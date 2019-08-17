import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { NavController, IonSegment } from '@ionic/angular';
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

  @ViewChild(IonSegment , null) ionSegment: IonSegment; 

  orderCount  = 0;

  cartSubscription;

  constructor(
    private navController: NavController,
    private logger: NGXLogger,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.cartSubscription = this.cart.observableTickets
    .subscribe(data => {
      this.orderCount = data.length;
    });
  }

  goTo(url) {
    this.navController.navigateForward(url);
  }

  setcurrentRoute(url) {
    this.ionSegment.value = url;
  }

  emitFilterClick() {
    this.filter.emit({});
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

}
