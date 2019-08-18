import { CartService } from '../../services/cart.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OrderLine, Store, Order } from 'src/app/api/models';
import { QueryResourceService, OfferCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { ShowAuxilaryModalComponent } from '../show-auxilary-modal/show-auxilary-modal.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-delivery-item-details',
  templateUrl: './delivery-item-details.component.html',
  styleUrls: ['./delivery-item-details.component.scss']
})
export class DeliveryItemDetailsComponent implements OnInit, OnDestroy {

  orders: OrderLine[] = [];

  totalPrice;

  deliveryCharge;

  products = {

    length: 0
  };

  auxilaryProducts = {

    lenght: 0
  };

  store: Store;

  storeSetting;

  cartSubscription;

  productGetSubscription = { };

  productsGot = false;

  constructor(
    private cart: CartService,
    private queryResource: QueryResourceService,
    private offerCommandResource: OfferCommandResourceService,
    private logger: NGXLogger,
    private popover: PopoverController
  ) {}

  ngOnInit() {
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartSubscription = this.cart.observableTickets.subscribe(data => {
      this.logger.info('Getting cart Details', data);
      this.totalPrice = this.cart.totalPrice;
      this.orders = data;
      this.storeSetting = this.cart.currentShopSetting;
      this.store = this.cart.currentShop;
      this.getAllProductsFromOrders();
      this.getAuxilaryproductsFromOrders();
    });
  }

  increaseProductCount(product , orderLine) {
    if (this.cart.auxilaryItems[product.id] !== undefined) {
      this.showAddAuxilaryPopover(product);
    } else {
      this.cart.increase(orderLine , product);
    }
  }

  decreaseProductCount(product , orderLine) {
    this.cart.decrease(orderLine , product);
  }

  removeOrder(orderLine, product) {
    this.logger.info('Removing Order ', orderLine);
    this.cart.removeOrder(orderLine);
  }

  increaseAuxilaryProductCount(product , orderLine) {
    this.cart.increaseAuxilary(product , orderLine);
  }

  decreaseAuxilaryProductCount(product , orderLine) {
    this.cart.decreaseAuxilary(product,orderLine);
  }

  removeAuxilaryOrder(product , orderLine) {
    this.cart.removeAuxilary(product , orderLine);
  }

  getAllProductsFromOrders() {
    this.orders.forEach(o => {
      if (this.products[o.productId] === undefined) {
        this.productGetSubscription[o.productId] = this.queryResource.findProductUsingGET(o.productId).subscribe(p => {
          this.products[o.productId] = p;
          if (this.orders.indexOf(o) === this.orders.length - 1) {
            this.productsGot = true;
            this.products.length = this.orders.length;
          }
        });
      }
    });
  }

  getAuxilaryproductsFromOrders() {
    this.orders.forEach(o => {
      if (o.requiedAuxilaries !== undefined && o.requiedAuxilaries.length > 0) {
        o.requiedAuxilaries.forEach(a => {
          this.queryResource.findProductUsingGET(a.productId)
          .subscribe(data => {
            this.auxilaryProducts[a.productId] = data;
          });
        });
      }
    });
  }

  getOffers() {
    let grandtotal = 0;
    this.orders.forEach(orderLine => {
      grandtotal += orderLine.pricePerUnit * orderLine.quantity;
    });
    this.offerCommandResource.checkOfferEligibilityUsingPOST({
      orderTotal: grandtotal
    })
    .subscribe(data => {
      console.log(data);
    });
  }

  async showAddAuxilaryPopover(p) {
    const popoverElement = await this.popover.create({
      component: ShowAuxilaryModalComponent,
      componentProps: {
          auxilaryItems: this.cart.auxilaryItems[p.id],
          product: p
        }
    });
    return await popoverElement.present();
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.orders.forEach(o => {
      if (this.productGetSubscription[o.productId] !== undefined) {
        this.productGetSubscription[o.productId].unsubscribe();
      }
    });
  }

}
