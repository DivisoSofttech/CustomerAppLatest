import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderLine, AuxilaryOrderLine, Product } from 'src/app/api/models';

@Component({
  selector: 'app-auxilary-product-card',
  templateUrl: './auxilary-product-card.component.html',
  styleUrls: ['./auxilary-product-card.component.scss'],
})
export class AuxilaryProductCardComponent implements OnInit {

  @Input() auxilaryItem: Product;

  auxilaryOrderLine: AuxilaryOrderLine = {};

  @Output() auxilaryUpdated = new EventEmitter();


  constructor(
    private cart: CartService
  ) { }

  ngOnInit() {
    this.auxilaryOrderLine = {
      productId: this.auxilaryItem.id,
      pricePerUnit: this.auxilaryItem.sellingPrice,
      quantity: 0
    };
  }

  add() {
    this.auxilaryOrderLine.quantity++;
    this.auxilaryOrderLine.total = this.auxilaryOrderLine.quantity * this.auxilaryOrderLine.pricePerUnit;
    if(this.auxilaryOrderLine.quantity > 0) {
      this.auxilaryUpdated.emit(this.auxilaryOrderLine);
    }
  }

  remove() {
    if(this.auxilaryOrderLine.quantity !== 0) {
      this.auxilaryOrderLine.quantity--;
      this.auxilaryOrderLine.total = this.auxilaryOrderLine.quantity * this.auxilaryOrderLine.pricePerUnit;
      this.auxilaryUpdated.emit(this.auxilaryOrderLine);
    }
  }


}
