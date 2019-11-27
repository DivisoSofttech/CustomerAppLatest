import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Store } from './../../api/models/store';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { KeycloakService } from 'src/app/services/security/keycloak.service';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnInit, OnDestroy {

  @Input() store: Store = {};

  @Input() viewType = 'normal';

  categories;

  rateReview = 0;

  reviewCount = 0;

  deliveryTypes = [];

  deliveryInfos = [];

  isFavourite = false;

  showFavourite = false;

  timeNow;
  deliveryOk: boolean;
  keycloakSubscription: any;
  reviewSubscription: any;
  storeTypeSubscription: any;
  storeDeliveryTypeSubscription: any;
  deliveryInfoSubscription: any;

  constructor(
    private favourite: FavouriteService,
    private queryResource: QueryResourceService,
    private nav: NavController,
    private logger: NGXLogger,
    private keycloakService: KeycloakService
  ) { }

  ngOnDestroy() {
    this.keycloakSubscription?this.keycloakSubscription.unsubscribe():null;
    this.reviewSubscription?this.reviewSubscription.unsubscribe():null;
    this.storeTypeSubscription?this.storeTypeSubscription.unsubscribe():null;
    this.storeDeliveryTypeSubscription?this.storeDeliveryTypeSubscription.unsubscribe():null;
  }

  ngOnInit() {

    console.log("Store>>>>>>>>>>>>>>>" , this.store);

    this.keycloakSubscription = this.keycloakService.getUserChangedSubscription()
      .subscribe((data: any) => {
        this.logger.info('Checking If guest : RestaurantCardComponet');
        if (data !== null) {
          if (data.preferred_username === 'guest') {
            this.showFavourite = false;
          } else {
            this.showFavourite = true;
          }
        } else {
          this.showFavourite = false;
          }
        });
    this.timeNow = new Date();
    this.reviewSubscription = this.queryResource.findReviewCountByStoreIdUsingGET(this.store.regNo).subscribe(
      res => {
        this.reviewCount = res;
      }
    );
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

  checkDeliveryExists() {
    this.deliveryTypes.forEach(d => {
      if (d.name === 'delivery') {
        this.deliveryOk = true;
      }
    });
  }

  addToFavourite(store: Store) {
    this.isFavourite = true;
    this.favourite.addToFavouriteStore(store, '/store/' + store.regNo);
  }

  removeFromFavourite(store) {
    this.isFavourite = false;
    this.favourite.removeFromFavorite(store, 'store');
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
