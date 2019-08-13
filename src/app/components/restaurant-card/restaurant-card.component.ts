import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Store } from './../../api/models/store';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnInit {

  @Input() store : any= {};

  @Input() viewType = 'normal';

  categories;

  deliveryTypes = [];

  deliveryInfos = [];

  isFavourite = false;

  timeNow;

  constructor(
    private favourite: FavouriteService,
    private queryResource: QueryResourceService,
    private nav: NavController
  ) { }

  ngOnInit() {
    this.timeNow = new Date();
    this.getStoreCategory();
    console.log(this.viewType)
    if(this.viewType === 'normal') {
      this.checkIfAlreadyFavourite();
      this.getStoreDeliveryInfo();
      this.getStoreDeliveryType();
    }
  }

  getStoreCategory() {
    console.log('Getting Category', this.store.regNo);
    this.queryResource
      .findStoreTypeByStoreIdUsingGET({ storeId: this.store.regNo })
      .subscribe(
        success => {
          console.log('Got Categpries' , success.content);
          this.categories = success.content;
        },
        err => {
          console.log('Error getting Store category' , this.store.regNo);
        }
      );
  }

  getStoreDeliveryType() {
    this.queryResource
    .findAllDeliveryTypesByStoreIdUsingGET({
      storeId: this.store.id
    })
    .subscribe(
      success => {
        this.deliveryTypes = success.content;
      },
      err => {}
    );
  }

  getStoreDeliveryInfo() {
    this.queryResource.findDeliveryInfoByStoreIdUsingGET(this.store.regNo)
    .subscribe(
      success => {
        this.deliveryInfos = success.content;
      },
      err => {}
    );
  }

  addToFavourite(store: Store) {
    this.isFavourite = true;
    this.favourite.addToFavouriteStore(store, '/hotel-menu/' + store.regNo);
  }

  removeFromFavourite(store) {
    this.isFavourite = false;
    this.favourite.removeFromFavorite(store, 'store');
  }

  checkIfAlreadyFavourite() {
    this.favourite.getFavourites()
    .subscribe(data => {
      console.log(this.favourite.getFavouriteStoresID());
      if(this.favourite.getFavouriteStoresID()
      .includes(this.store.id)) {
        this.isFavourite = true;
      }
    });
  }

  showHotelMenu(regno) {
    this.nav.navigateForward('/store/' + regno);
  }

}
