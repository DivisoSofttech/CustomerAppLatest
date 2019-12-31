import { FilterService, FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, ModalController, Platform } from '@ionic/angular';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { PlaceSuggestionComponent } from 'src/app/components/place-suggestion/place-suggestion.component';
import { LocationService } from 'src/app/services/location-service';
import { ErrorService } from 'src/app/services/error.service';
import { Store } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { BannerComponent } from 'src/app/components/banner/banner.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss']
})
export class RestaurantPage implements OnInit, OnDestroy {

  showLoading: Boolean = true;

  showFilters: Boolean = false;

  page: number = 0;

  stores: Store[] = [];

  currentPlaceName: string = '';

  currentFilter: FILTER_TYPES;

  filterString: string;

  isGuest: Boolean = false;

  hideFooter: Boolean = false;

  currentLatLon: any;

  keycloakSubscription: any;
  backButtonSubscription: any;
  filterSubscription: any;

  @ViewChild(IonInfiniteScroll, null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  @ViewChild(FooterComponent, null) footer: FooterComponent;
  @ViewChild(BannerComponent, null) banner: BannerComponent;



  constructor(
    private filter: FilterService,
    private util: Util,
    private logger: LogService,
    private modalController: ModalController,
    private locationService: LocationService,
    private errorService: ErrorService,
    private keycloakService: KeycloakService,
    private sharedData: SharedDataService,
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.checkIfGuest();
    this.getCurrentLocation();
    this.getStores();
  }

  // Fix for Footer
  ionViewDidEnter() {
    this.footer.setcurrentRoute('restaurant');
  }

  checkIfGuest() {
    this.logger.info(this, 'Checking if guest')
    this.keycloakSubscription = this.keycloakService.getUserGuestSubscription()
      .subscribe(data => {
        if (data !== null) {
          this.isGuest = data;
        } else {
          this.isGuest = true;
        }
      });
  }

  getCurrentLocation() {
    this.logger.info(this, 'Getting Current Location');
    this.locationService.getLocation()
      .subscribe(value => {
        if (value !== null) {
          this.currentPlaceName = value.name;
          this.filter.setCoordinates(value.coords);
          this.currentLatLon = value.coords ? value.latLon : value.coords;
          // Activate Distance Filter if No Other Filter is Applied
          this.activateDistanceFilter();
          this.logger.info(this, 'Current Place Name ', this.currentPlaceName);
          this.logger.info(this, 'Getting LatLon for current Location', value.coords);
        }
      });
  }

activateDistanceFilter() {
    this.sharedData.getData('filter')
    .then(data => {
      if (!data) {
        
        this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
      }
    })
  }

  async getStores() {
    this.filterSubscription = this.filter.getSubscription().subscribe((data: FILTER_TYPES) => {

      if (data !== undefined) {
        this.currentFilter = data;
        if (data.valueOf() == FILTER_TYPES.MIN_AMOUNT.valueOf()) {
          this.filterString = "Min amount";
        } else if (data.valueOf() == FILTER_TYPES.TOP_RATED.valueOf()) {
          this.filterString = "Top rated";
        } else if (data.valueOf() == FILTER_TYPES.CUSINE_FILTER.valueOf()) {
          this.filterString = "Cusines";
        } else {
          this.filterString = '';
        }
        this.showLoading = true;
        this.stores = [];
        this.toggleInfiniteScroll();
        this.filter.getStores(0, (totalElements, totalPages, stores) => {

          this.logger.info(this, 'Got Stores ', stores);
          if (totalPages > 1) {
            this.logger.info(this, 'Enabling Infinite Scroll');
            this.toggleInfiniteScroll();
          }
          this.stores = [];
          stores.forEach(s => {
            this.stores.push(s);
          });
          this.showLoading = false;
          this.logger.info(this, "Disabling Loader", this.showLoading);
          this.toggleIonRefresher();
          if(!this.cdr['destroyed'])
          this.cdr.detectChanges();
        },
          () => {
            this.errorService.showErrorModal(this);
          });
      }
    });
  }

  searchClicked(event) {
    if (event) {
      this.hideFooter = true;
    } else {
      this.hideFooter = false;
    }
  }


  loadMoreStores(event) {
    this.logger.info(this, 'Load More Stores if exists');
    ++this.page;
    this.filter.getStores(this.page, (totalElements, totalPages, stores) => {
      event.target.complete();
      this.logger.info(this, 'Got Stores Page :', this.page, '----', stores);
      if (this.page === totalPages) {
        this.toggleInfiniteScroll();
      }
      if (totalPages === 1) {
        this.toggleInfiniteScroll();
      } else {
        stores.forEach(s => {
          this.stores.push(s);
        });
      }
    });
  }

  doRefresh(event) {
    this.page = 0;
    this.filterSubscription.unsubscribe();
    this.logger.info(this, 'Refreshing Page');
    this.banner.refresh();
    this.getStores();
  }

  toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }

  toggleIonRefresher() {
    this.logger.info(this, 'Disableing Ion Refresher');
    this.IonRefresher.complete();
  }

  toggleFilteromponent(event) {
    if (event === 'close') {
      this.showFilters = false;
      this.footer.filterHide = false;
      this.footer.setcurrentRoute('restaurant');
    } else {
      this.showFilters = true;
      this.footer.filterHide = true;
    }
  }

  async showPlaceSelectionModal() {
    this.util.createLoader()
      .then(async loader => {
        loader.present();
        const modal = await this.modalController.create(
          {
            component: PlaceSuggestionComponent,
            componentProps: { currentPlaceName: this.currentPlaceName }
          }
        );
        modal.onDidDismiss()
          .then(data => {
            if (data !== undefined && data.data !== undefined) {
              this.toggleInfiniteScroll();
              this.sharedData.deleteData('filter');
              if (data.data.currentLocation && data.data.locationChanged) {
                this.logger.info(this, 'Setting Current Location ', data);
                this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
              } else if (!data.data.currentLocation && !data.data.distanceChanged) {
                this.logger.info(this, 'Updating Current Location ', data);
                this.updatedLocation(data);
              } else if (data.data.distanceChanged) {
                this.logger.info(this, 'Distance Changed ', data);
                this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
              }
            }
          });
        modal.present()
          .then(() => {
            loader.dismiss();
          });
      });
  }

  updatedLocation(data) {
    this.logger.info(this, 'Changed Current Location - LatLon ', data);
    this.filter.setCoordinates(data.data.latLon);
    this.currentPlaceName = data.data.name;
    this.currentLatLon = data.data.latLon;
    this.logger.info(this, 'Setting Distance_wise Filter');
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    this.logger.info(this, 'Getting Stores');
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.showFilters = false;
    });
  }

  ngOnDestroy(): void {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
  }

}
