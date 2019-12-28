import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Store } from './../../api/models/store';
import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { StoreType, Type, DeliveryInfo, Banner } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';
import { LocationService } from 'src/app/services/location-service';

declare var google: any;

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnInit, OnDestroy {

  @Input() store: Store = {
    imageLink: '',
    storeUniqueId: ''
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

  @Input() currentLatLon = [];
  distance: number;

  banners:Banner[] = [];


  slideOpts = {
    preloadImages:true,
    lazy:false,
    slidesPerView: this.platform.width() < 1280?this.platform.width()<400?1:2:2,
    on: {
      beforeInit() {
        const swiper = this;
  
        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  }


  constructor(
    private favourite: FavouriteService,
    private queryResource: QueryResourceService,
    private nav: NavController,
    private logger: LogService,
    private locationService: LocationService,
    private platform: Platform
  ) { }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.reviewSubscription ? this.reviewSubscription.unsubscribe() : null;
    this.storeTypeSubscription ? this.storeTypeSubscription.unsubscribe() : null;
    this.storeDeliveryTypeSubscription ? this.storeDeliveryTypeSubscription.unsubscribe() : null;
  }



  ngOnInit() {

    this.logger.info(this, 'Current Store ', this.store)
    this.currentTime = new Date();
    this.getStoreReview();
    this.getStoreCategory();
    if (this.viewType === 'normal') {
      this.checkIfAlreadyFavourite();
      this.getStoreDeliveryInfo();
      this.getStoreDeliveryType();
      this.getDistance();
    } else if(this.viewType === 'detailedCard'){
      this.getRestaurantBanners(0);
    }
  }

  getDistance() {
    if(this.store.location) {
      let storeLocation = this.store.location.split(',');
      let currentLatLng = new google.maps.LatLng(this.currentLatLon[0], this.currentLatLon[1]);
      let restaurantLtLng = new google.maps.LatLng(storeLocation[0], storeLocation[1]);
      this.distance = this.locationService.calculateDistance(
        currentLatLng,
        restaurantLtLng
      )/1000;  
    }
  }

  getRestaurantBanners(i) {
    this.logger.info(this,'Fetching Banners')
    this.queryResource.findBannersByRegNoUsingGET({
      regNo: this.store.regNo
    }).subscribe(data => {
      this.logger.info(this,'Fetched Banners' , data);
      data.content.forEach(b => {
        this.banners.push(b);
      })
      i++;
      if(i < data.totalPages) {
        this.getRestaurantBanners(i);
      } else {

      }
    })
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
    this.deliveryInfoSubscription = this.queryResource.findDeliveryInfoByStoreIdUsingGET({ storeId: this.store.regNo })
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
