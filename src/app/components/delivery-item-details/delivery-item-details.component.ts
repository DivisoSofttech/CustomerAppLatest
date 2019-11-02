import { CartService } from '../../services/cart.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OrderLine, Store, Order, AuxilaryLineItem, Offer } from 'src/app/api/models';
import { QueryResourceService, OfferCommandResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { ShowAuxilaryModalComponent } from '../show-auxilary-modal/show-auxilary-modal.component';
import { PopoverController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DecimalPipe } from '@angular/common';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-delivery-item-details',
  templateUrl: './delivery-item-details.component.html',
  styleUrls: ['./delivery-item-details.component.scss']
})
export class DeliveryItemDetailsComponent implements OnInit, OnDestroy {

  orders: OrderLine[] = [];

  totalPrice;
  total;
  subTotal;
  deliveryCharge;

  products = {

    length: 0
  };

  auxilaryProducts = {

    length: 0
  };

  store: Store;

  storeSetting;

  cartSubscription;

  productGetSubscription = { };

  productsGot = false;

  productBaseAuxItemsArray = {};
  offer;

  auxilaryItems;

  @Input() currentDeliveryMode = 'delivery';

  constructor(
    private cart: CartService,
    private queryResource: QueryResourceService,
    private offerCommandResource: OfferCommandResourceService,
    private logger: NGXLogger,
    private popover: PopoverController,
    private orderService: OrderService,
    private decimalPipe: DecimalPipe,
    private util: Util
  ) {}

  ngOnInit() {
    this.getCartDetails();
    this.productBaseAuxItemsArray = this.cart.auxilaryItems;
    this.getOffers();
  }
  
  animateSlide() {

  }
  
  getCartDetails() {
    this.cartSubscription = this.cart.observableTickets.subscribe(data => {
      this.logger.info('Getting cart Details', data);
      this.orders = data;
      this.storeSetting = this.cart.currentShop.storeSettings;
      this.totalPrice = this.cart.totalPrice ;
      if(this.storeSetting !== undefined) {
        this.total = this.totalPrice + this.storeSetting.deliveryCharge ;
      }
      this.subTotal = this.cart.totalPrice;
      this.store = this.cart.currentShop;
      this.auxilaryItems = this.cart.auxilaryItems;
      this.getAllProductsFromOrders();
      this.getAuxilaryproductsFromOrders();
    });
  }

  increaseProductCount(product , orderLine) {
    if (this.cart.auxilaryItems[product.id].length !== 0) {
      this.showAddAuxilaryPopover(product);
    } else {
      this.cart.increase(orderLine , product);
    }
    this.getOffers();
  }

  decreaseProductCount(product , orderLine) {
    this.cart.decrease(orderLine , product);
    this.getOffers();
  }

  removeOrder(orderLine, product) {
    this.logger.info('Removing Order ', orderLine);
    this.cart.removeOrder(orderLine);
    this.getOffers();
  }

  increaseAuxilaryProductCount(product , orderLine) {
    this.cart.increaseAuxilary(product , orderLine);
    this.getOffers();
  }

  decreaseAuxilaryProductCount(product , orderLine) {
    this.cart.decreaseAuxilary(product, orderLine);
    this.getOffers();
  }

  removeAuxilaryOrder(product , orderLine) {
    this.cart.removeAuxilary(product , orderLine);
    this.getOffers();
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
    this.util.createCustomLoader('circles', 'Checking Offers').then(loader => {
    loader.present();
    this.logger.info('Checking offer eligibility using price ', this.subTotal);
    let offerPrice;
    offerPrice = this.decimalPipe.transform(this.totalPrice, '1.1-2');
    this.orderService.claimMyOffer(offerPrice)
    .then(orderBehaviour => {
      orderBehaviour.subscribe(response => {
        this.logger.info('response for cliam offer ' , response);
        if (response.orderDiscountAmount === null) {
          this.logger.info('No offers available');
        } else {
          this.logger.info('One offer available ', response.promoCode);
          this.offer = response;
          this.total = this.total - response.orderDiscountAmount;
          this.logger.info('Checking offer eligibility using price >>>>>>>', this.total);

          this.cart.totalPrice = this.total;
          const myOffer: Offer = {
            offerRef : response.promoCode
          };
          this.orderService.setOffer(myOffer);
          loader.dismiss();
        }
      });
    });
  });
  }

  async showAddAuxilaryPopover(p) {
    console.warn('kjkjkjkj' , this.cart.auxilaryItems[p.id]);
    const popoverElement = await this.popover.create({
      component: ShowAuxilaryModalComponent,
      componentProps: {
          auxilaryItems: this.cart.auxilaryItems[p.id],
          product: p
        }
    });
    return await popoverElement.present();
  }

  async showUpdateAuxilaryPopover(ol: OrderLine) {
    const tempAuxilaryItems = [];

    this.cart.auxilaryItems[ol.productId]
    .forEach((ai: AuxilaryLineItem) => {
      // check if ai exists in any of auxilaryitems
      const index = ol.requiedAuxilaries.findIndex(auxLine => auxLine.productId === ai.auxilaryItem.id);
      if (index === -1) {
        tempAuxilaryItems.push(ai);
      }
    });

    const popoverElement = await this.popover.create({
      component: ShowAuxilaryModalComponent,
      componentProps: {
          auxilaryItems: tempAuxilaryItems,
          orderLine: ol,
          type: 'update'
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
