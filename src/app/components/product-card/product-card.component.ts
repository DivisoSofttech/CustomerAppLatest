import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { StockCurrent, AuxilaryLineItem, ComboLineItem, Discount, OrderLine, AuxilaryOrderLine, CancelledOrderLine, Product } from 'src/app/api/models';
import { PopoverController, IonInput } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { ShowAuxilaryModalComponent } from '../show-auxilary-modal/show-auxilary-modal.component';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {

  @Input() stockCurrent: StockCurrent;

  @Input() store;

  @Input() showDescription = false;

  @Input() type = 'full';

  @Input() auxilaries: AuxilaryLineItem[] = [];

  @Input() comboLineItems: ComboLineItem[] = [];

  @Input() orderLine: OrderLine;

  @Input() cancelledOrderLine: CancelledOrderLine;

  @Input() auxilaryOrderLine: AuxilaryOrderLine[] = [];

  @Input() auxilariesProducts = [];

  @Input() product: Product;

  @Input() auxTotal = 0;

  @Input() orderCount = 0;

  @Input()   isGuest = false;

  isFavourite = false;

  auxilaryLoadComplete = false;

  discount: Discount;


  @ViewChild('orderCountInput', null) orderCountInput: IonInput;
  auxilariesSubscription: any;
  comboSusbcription: any;
  favouriteSubscription: any;
  checkOrderedSubscription: any;
  productDiscountSubscription: any;

  constructor(
    private favourite: FavouriteService,
    private popover: PopoverController,
    private queryResource: QueryResourceService,
    private router: Router,
    private cartService: CartService,
    private logger: LogService,
  ) { }

  ngOnDestroy() {
    this.auxilariesSubscription ? this.auxilariesSubscription.unsubscribe() : null;
    this.comboSusbcription ? this.comboSusbcription.unsubscribe() : null;
    this.favouriteSubscription ? this.favouriteSubscription.unsubscribe() : null;
    this.checkOrderedSubscription ? this.checkOrderedSubscription.unsubscribe() : null;
    this.productDiscountSubscription ? this.productDiscountSubscription.unsubscribe() : null;
  }

  ngOnInit() {
    if (this.type === 'full') {
      this.checkIfAlreadyFavourite();
      this.checkIfOrdered();
      this.getAuxilaries(0);
      this.getProductDiscount();
      if (this.stockCurrent.product.isAuxilaryItem === false) {
        this.getComboItems(0);
      }
    } else {
    }
  }

  addToFavourite(product) {
    this.isFavourite = true;
    this.favourite.addToFavouriteProduct(product, this.router.url.split('#')[0]);
  }

  removeFromFavourite(product) {
    this.isFavourite = false;
    this.favourite.removeFromFavorite(product, 'product');
  }

  getAuxilaries(i) {
    this.auxilariesSubscription = this.queryResource.findAuxilariesByProductIdUsingGET({productId: this.stockCurrent.product.id})
      .subscribe(data => {
        i++;
        data.content.forEach(a => {
          this.auxilaries.push(a);
        });
        this.logger.info(this,'Got Auxilary For Product ', this.stockCurrent.product.name, data.content);
        ++i;
        if (i < data.totalPages) {
          this.getAuxilaries(i);
        } else {
          this.auxilaryLoadComplete = true;
          this.cartService.auxilaryItems[this.stockCurrent.product.id] = this.auxilaries;
        }
      });
  }


  getComboItems(i) {
    this.comboSusbcription = this.queryResource.findComboByProductIdUsingGET({productId: this.stockCurrent.product.id})
      .subscribe(data => {
        i++;
        data.content.forEach(a => {
          this.comboLineItems.push(a);
        });
        this.logger.info(this,'Got ComboLineItem For Product ', this.stockCurrent.product.name, data.content);
        ++i;
        if (i < data.totalPages) {
          this.getComboItems(i);
        }
      });
  }

  checkIfAlreadyFavourite() {
    this.favourite.getFavouriteProductsID()
    .subscribe(data => {
      if(data.includes(this.stockCurrent.product.id)) {
        this.isFavourite = true;
      } else {
        this.isFavourite = false;
      }
    })
  }

  customAdd(stock) {
    this.logger.info(stock);
  }

  add(i, stock: StockCurrent) {
  
    if(this.cartService.currentShopId === 0) {
      this.cartService.addShop(this.store);
      this.cartService.behaviourStore.next(this.store);
      this.add(i,stock);
    }
    else if (this.store.regNo !== this.cartService.storeId) {
      this.cartService.presentRestaurantCheckout(()=>{
        this.cartService.emptyCart();
        this.cartService.addShop(this.store);
        this.cartService.behaviourStore.next(this.store);
        this.add(i,stock);     
     });
    } else {
      if (this.auxilaries.length > 0 && this.stockCurrent.product.isAuxilaryItem === false) {
        this.logger.info(this,'Add Auxilary Items ', this.auxilaries);
        this.cartService.addAuxilary(this.stockCurrent.product, this.auxilaries);
        this.showAddAuxilaryPopover();
      } else {
        this.logger.info(this,'No Auxilary Items ', this.auxilaries);
        this.cartService.addProduct(stock.product, stock, this.store);
      }  
    }
  }

  remove(i, stock: StockCurrent) {
    this.cartService.removeProduct(stock);
  }

  async showAddAuxilaryPopover() {
    this.cartService.addShop(this.store);
    const popoverElement = await this.popover.create({

      component: ShowAuxilaryModalComponent,
      componentProps: {
        auxilaryItems: this.auxilaries,
        product: this.stockCurrent.product,
        stockCurrent: this.stockCurrent,
        store: this.store
      }
    });
    return await popoverElement.present();
  }

  checkIfOrdered() {
    this.checkOrderedSubscription = this.cartService.observableTickets
      .subscribe(data => {
        const ol = data.filter(o => o.productId === this.stockCurrent.product.id);
        this.orderCount = 0;
        ol.forEach(o => {
          this.orderCount = this.orderCount + o.quantity;
        });
        if (ol.length === 0) {
          this.orderCount = 0;
        }
      });
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

  getProductDiscount() {
    this.productDiscountSubscription = this.queryResource.findDiscountByProductIdUsingGET(this.stockCurrent.product.id)
      .subscribe(discount => {
        this.discount = discount;
        if (this.discount && this.discount.rate) {
          this.stockCurrent.sellPrice =
            Math.round((this.stockCurrent.sellPrice - (this.stockCurrent.product.sellingPrice * this.discount.rate / 100)) * 100) / 100;
        }
      });
  }

}
