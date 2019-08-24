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

  @Input() type = 'add';

  constructor(
    private popover: PopoverController,
    private cart: CartService
  ) { }

  ngOnInit() {
    if (this.type !== 'update') {
      this.orderLine = {
        pricePerUnit: this.product.sellingPrice,
        productId: this.product.id,
        quantity: 1,
        total: 0
      };
    }
  }

  dismiss() {
    this.popover.dismiss();
  }

  auxilaryUpated(event: AuxilaryOrderLine) {

      const tempArray = this.auxilaryOrderLines.find(al => al.productId == event.productId);
      if(tempArray !== undefined) {
          const i = this.auxilaryOrderLines.indexOf(event);
          this.auxilaryOrderLines[i] = event;
          console.log('Updating Auxilary OrderLine' , this.auxilaryOrderLines);
      } else {
          console.log('Adding Auxilary OrderLine' , this.auxilaryOrderLines);
          this.auxilaryOrderLines.push(event);
      }
  }

  addToCart() {
    let total = 0;
    this.auxilaryOrderLines = this.auxilaryOrderLines.filter(al => al.quantity !== 0);
    this.auxilaryOrderLines.forEach(al => {
      total = total + al.total;
    });
    this.orderLine.requiedAuxilaries = this.auxilaryOrderLines;
    this.orderLine.total = this.orderLine.pricePerUnit + total;
    console.log('Adding Order Line ' , this.orderLine);
    this.cart.addOrder(this.orderLine);
    this.dismiss();

  }

  updateAuxilariesAndAddToCart() {
    this.auxilaryOrderLines.forEach(auxLine => {
      this.orderLine.requiedAuxilaries.push(auxLine);
      this.cart.updateOrder(this.orderLine);
    });
    this.dismiss();
  }
}
