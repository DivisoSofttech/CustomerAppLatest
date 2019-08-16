import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input } from '@angular/core';
import { StockCurrent, AuxilaryLineItem } from 'src/app/api/models';
import { ModalController, PopoverController } from '@ionic/angular';
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

  isFavourite = false;

  orderCount  = 0;

  constructor(
    private favourite: FavouriteService,
    private modalController: ModalController,
    private queryResource: QueryResourceService,
    private router: Router,
    private cartService: CartService,
    private logger: NGXLogger,
    private util: Util
  ) { }

  ngOnInit() {
    this.checkIfAlreadyFavourite();
    this.checkIfOrdered();
    if(this.stockCurrent.product.isAuxilaryItem === false) {
      this.getAuxilaries(0);
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
      data.content.forEach(a => {
        this.auxilaries.push(a);
      });
      this.logger.info('Got Auxilary For Product ' , this.stockCurrent.product.name , data.content);
      ++i;
      if (i < data.totalPages) {
        this.getAuxilaries(i);
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

  add(i, stock: StockCurrent) {
  
    if(this.auxilaries.length > 0 && this.stockCurrent.product.isAuxilaryItem === false) {
      this.logger.info('Add Auxilary Items ' , this.auxilaries);
      this.showAddAuxilaryModal();
      // this.cartService.addProduct(stock.product, stock , this.store);
    } else {
      this.logger.info('No Auxilary Items ' , this.auxilaries);
      this.cartService.addProduct(stock.product, stock , this.store);
    }
  }

  remove(i, stock: StockCurrent) {
      this.cartService.removeProduct(stock);
  }

  async showAddAuxilaryModal() {

    const modal = await this.modalController.create(
      {
        component: ShowAuxilaryModalComponent,
        componentProps: {
          auxilaryItems: this.auxilaries,
          product: this.stockCurrent.product
        }
      }
    );
    modal.present();
  }

  checkIfOrdered() {
    this.cartService.observableTickets
    .subscribe(data => {
      const p = data.filter(o => o.productId === this.stockCurrent.product.id);
      console.log(p);
      if (p.length > 0) {
        this.orderCount = p[0].quantity;
      } else {
        this.orderCount = 0;
      }
    });
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

}
