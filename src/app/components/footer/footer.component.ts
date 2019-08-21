import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { NavController, IonSegment, Platform } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit , OnDestroy {

  @Output() filter = new EventEmitter();

  @ViewChild(IonSegment , null) ionSegment: IonSegment;

  orderCount  = 0;
  showTabs = true;
  cartSubscription;

  constructor(
    private navController: NavController,
    private logger: NGXLogger,
    private cart: CartService,
    private platform: Platform
  ) {
  }

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
    if(this.ionSegment !== null) {
      this.ionSegment.value = url;
    }
  }

  emitFilterClick() {
    this.filter.emit({});
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

}
