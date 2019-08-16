import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderLine, AuxilaryOrderLine } from 'src/app/api/models';

@Component({
  selector: 'app-auxilary-product-card',
  templateUrl: './auxilary-product-card.component.html',
  styleUrls: ['./auxilary-product-card.component.scss'],
})
export class AuxilaryProductCardComponent implements OnInit {

  order: AuxilaryOrderLine;

  @Input() auxilaryItem;

  orderCount = 0;

  constructor(
    private cart: CartService
  ) { }

  ngOnInit() {}

  addToCart(auxilaryItem) {

  }

}
