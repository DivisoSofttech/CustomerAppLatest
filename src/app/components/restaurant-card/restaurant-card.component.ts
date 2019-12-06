import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Store } from './../../api/models/store';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { StoreType, Type, DeliveryInfo } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnInit, OnDestroy {

  @Input() store: Store = {
    imageLink:'',
    storeUniqueId:''
  };

  @Input() viewType: string = 'normal';

  @Input() isPreOrderAvailable = false;

  @Input() isGuest = false;

  categories: StoreType[] = [];

  deliveryTypes: Type[] = [];

  deliveryInfos: DeliveryInfo[] = [];

  rateReview: number = 0;

  reviewCount: number = 0;

  isFavourite = false;
  currentTime: Date;
  deliveryOk: boolean;

  reviewSubscription: any;
  storeTypeSubscription: any;
  storeDeliveryTypeSubscription: any;
  deliveryInfoSubscription: any;

  constructor(
    private favourite: FavouriteService,
    private queryResource: QueryResourceService,
    private nav: NavController,
    private logger: LogService,
    private keycloakService: KeycloakService,
    private util: Util
  ) { }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.reviewSubscription?this.reviewSubscription.unsubscribe():null;
    this.storeTypeSubscription?this.storeTypeSubscription.unsubscribe():null;
    this.storeDeliveryTypeSubscription?this.storeDeliveryTypeSubscription.unsubscribe():null;
  }

  ngOnInit() {

    this.logger.info(this,'Current Store ' , this.store)
    this.currentTime = new Date();
    this.getStoreReview();
    this.getStoreCategory();
    if (this.viewType === 'normal') {
      this.checkIfAlreadyFavourite();
      this.getStoreDeliveryInfo();
      this.getStoreDeliveryType();
    }
  }

  getStoreCategory() {
    this.logger.info('Getting Category', this.store.regNo);
    this.storeTypeSubscription = this.queryResource
      .findStoreTypeByStoreIdUsingGET({ storeId: this.store.regNo })
      .subscribe(
        success => {
          this.logger.info('Got Categories ', this.store.regNo, success.content);
          this.categories = success.content;
        },
        err => {
          this.logger.fatal('Error getting Store category', this.store.regNo, err);
        }
      );
  }

  getStoreDeliveryType() {
    this.storeDeliveryTypeSubscription = this.queryResource
      .findAllDeliveryTypesByStoreIdUsingGET({
        storeId: this.store.id
      })
      .subscribe(
        success => {
          this.deliveryTypes = success.content;
          this.checkDeliveryExists();
        },
        err => { }
      );
  }

  getStoreDeliveryInfo() {
    this.deliveryInfoSubscription = this.queryResource.findDeliveryInfoByStoreIdUsingGET({storeId: this.store.regNo})
      .subscribe(
        success => {
          this.deliveryInfos = success.content;
        },
        err => { }
      );
  }

  getStoreRating() {

  }

  getStoreReview() {
    this.reviewSubscription = this.queryResource.findUserRatingReviewCountByRegNoUsingGET(this.store.regNo).subscribe(
      res => {
        this.reviewCount = res;
      }
    );
  }

  addToFavourite(store: Store) {
    this.isFavourite = true;
    this.favourite.addToFavouriteStore(store, '/store/' + store.regNo);
  }

  removeFromFavourite(store) {
    this.isFavourite = false;
    this.favourite.removeFromFavorite(store, 'store');
  }

  checkDeliveryExists() {
    this.deliveryTypes.forEach(d => {
      if (d.name === 'delivery') {
        this.deliveryOk = true;
      }
    });
  }
  
  checkIfAlreadyFavourite() {
    this.favourite.getFavourites()
      .subscribe(data => {
        if (this.favourite.getFavouriteStoresID()
          .includes(this.store.id)) {
          this.isFavourite = true;
        }
      });
  }

  showHotelMenu(regno) {
    this.nav.navigateForward('/store/' + regno);
  }
}
