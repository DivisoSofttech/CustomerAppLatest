import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
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

  @Input() currentRoute;

  orderCount  = 0;

  constructor(
    private navController: NavController,
    private logger: NGXLogger,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.cart.observableTickets
    .subscribe(data => {
      this.orderCount = data.length;
    });
  }

  goTo(url) {
    this.navController.navigateForward(url);
  }

  emitFilterClick() {
    this.filter.emit('');
  }

  ngOnDestroy() {
    console.log('destroy');
  }

}
