import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StockCurrent, AuxilaryLineItem, ComboLineItem, Discount } from 'src/app/api/models';
import { ModalController, PopoverController, IonInput } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { ShowAuxilaryModalComponent } from '../show-auxilary-modal/show-auxilary-modal.component';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {

  @Input() stockCurrent: StockCurrent;

  @Input() store;

  @Input() showDescription = false;

  auxilaries: AuxilaryLineItem[] = [];

  comboLineItems: ComboLineItem[] = [];

  isFavourite = false;

  orderCount  = 0;
  auxilaryLoadComplete = false;
  discount: Discount;

  @ViewChild('orderCountInput' , null) orderCountInput: IonInput;

  constructor(
    private favourite: FavouriteService,
    private modalController: ModalController,
    private popover: PopoverController,
    private queryResource: QueryResourceService,
    private router: Router,
    private cartService: CartService,
    private logger: NGXLogger,
    private util: Util
  ) { }

  async ngOnInit() {
    this.checkIfAlreadyFavourite();
    this.checkIfOrdered();
    this.getAuxilaries(0);
    this.getProductDiscount();
    if (this.stockCurrent.product.isAuxilaryItem === false) {
      this.getComboItems(0);
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
    this.queryResource.findAuxilariesByProductIdUsingGET(this.stockCurrent.product.id)
    .subscribe(data => {
      i++;
      data.content.forEach(a => {
        this.auxilaries.push(a);
      });
      this.logger.info('Got Auxilary For Product ' , this.stockCurrent.product.name , data.content);
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
    this.queryResource.findComboByProductIdUsingGET(this.stockCurrent.product.id)
    .subscribe(data => {
      i++;
      data.content.forEach(a => {
        this.comboLineItems.push(a);
      });
      this.logger.info('Got ComboLineItem For Product ' , this.stockCurrent.product.name , data.content);
      ++i;
      if (i < data.totalPages) {
        this.getComboItems(i);
      }
    });
  }

  checkIfAlreadyFavourite() {
    this.favourite.getFavourites()
    .subscribe(data => {
      if (this.favourite.getFavouriteProductsID()
      .includes(this.stockCurrent.product.id)) {
        this.isFavourite = true;
      }
    });
  }

  customAdd(stock) {
    this.logger.info(stock);
  }

  add(i, stock: StockCurrent) {
    this.cartService.addShop(this.store);
    if (this.auxilaries.length > 0 && this.stockCurrent.product.isAuxilaryItem === false) {
      this.logger.info('Add Auxilary Items ' , this.auxilaries);
      this.cartService.addAuxilary(this.stockCurrent.product , this.auxilaries);
      if (this.cartService.currentShopId === this.store.id) {
        this.showAddAuxilaryPopover();
      } else {
        this.cartService.presentAlert();
      }
    } else {
      this.logger.info('No Auxilary Items ' , this.auxilaries);
      this.cartService.addProduct(stock.product, stock , this.store);
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
          product: this.stockCurrent.product
        }
    });
    return await popoverElement.present();
  }

  checkIfOrdered() {
    this.cartService.observableTickets
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
    console.log('sjhsjhsjhjs');
    this.showDescription = !this.showDescription;
  }

  getProductDiscount() {
    this.queryResource.findDiscountByProductIdUsingGET(this.stockCurrent.product.id)
      .subscribe(discount => {
        this.discount = discount;
        if (this.discount && this.discount.rate) {
          this.stockCurrent.sellPrice =
           Math.round((this.stockCurrent.sellPrice - (this.stockCurrent.product.sellingPrice * this.discount.rate / 100)) * 100) / 100;
        }
      });
  }

}
