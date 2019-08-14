import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input } from '@angular/core';
import { StockCurrent } from 'src/app/api/models';
import { ModalController, PopoverController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {

  @Input() stockCurrent: StockCurrent;

  @Input() store;

  @Input() showDescription = false;

  isFavourite = false;

  orderCount  = 0;

  constructor(
    private favourite: FavouriteService,
    private queryResource: QueryResourceService,
    private popoverController: PopoverController,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.checkIfAlreadyFavourite();
    this.checkIfOrdered();
    this.getAuxilaries();
  }
  
  addToFavourite(product) {
    this.isFavourite = true;
    this.favourite.addToFavouriteProduct(product, this.router.url.split('#')[0]);
  }

  removeFromFavourite(product) {
    this.isFavourite = false;
    this.favourite.removeFromFavorite(product, 'product');
  }

  getAuxilaries() {
    
  }

  checkIfAlreadyFavourite() {
    this.favourite.getFavourites()
    .subscribe(data => {
      console.log(this.favourite.getFavouriteProductsID());
      if(this.favourite.getFavouriteProductsID()
      .includes(this.stockCurrent.product.id)) {
        this.isFavourite = true;
      }
    });
  }

  add(i, stock: StockCurrent) {

    if (this.cartService.addProduct(stock.product, stock , this.store)) {
    }
  }

  remove(i, stock: StockCurrent) {
      this.cartService.removeProduct(stock);
  }

  checkIfOrdered() {
    this.cartService.observableTickets
    .subscribe(data => {
      console.log('Orders ' , data);
      const p = data.filter(o => o.productId === this.stockCurrent.product.id);
      console.log(p);
      if(p.length > 0) {
        this.orderCount=p[0].quantity;
      } else {
        this.orderCount = 0;
      }
    });
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

}
