import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { OrderLine, Product, AuxilaryOrderLine } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-show-auxilary-modal',
  templateUrl: './show-auxilary-modal.component.html',
  styleUrls: ['./show-auxilary-modal.component.scss'],
})
export class ShowAuxilaryModalComponent implements OnInit {

  @Input() auxilaryItems = [];

  @Input() product: Product;

  orderLine: OrderLine;

  auxilaryOrderLines: AuxilaryOrderLine[] = [];

  constructor(
    private popover: PopoverController,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.orderLine = {
      pricePerUnit: this.product.sellingPrice,
      productId: this.product.id,
      quantity: 1,
      total: 0
    };
  }

  dismiss() {
    this.popover.dismiss();
  }

  auxilaryUpated(event) {
    const tempArray = this.auxilaryOrderLines.filter(al =>  al.productId === event.productId);
    if(tempArray.length > 0) {
      this.auxilaryOrderLines.map(
        (m , i) => {
          if (m.productId === event.productId) {
            m[i] = event;
          }
        }
      );
    } else {
      this.auxilaryOrderLines.push(event);
    }

  }

  addToCart() {
    let total = 0;
    this.auxilaryOrderLines.forEach(al => {
      total = total + al.total;
    });
    this.orderLine.requiedAuxilaries = this.auxilaryOrderLines;
    this.orderLine.total = this.orderLine.pricePerUnit + total;
    this.cart.addOrder(this.orderLine);
    this.dismiss();

  }
}
