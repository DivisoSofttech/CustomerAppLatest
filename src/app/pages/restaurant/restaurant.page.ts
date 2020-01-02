import { FilterService, FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
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
import { LocationModel } from 'src/app/models/location-model';

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
      .subscribe((value: LocationModel) => {
        if (value !== null) {
          this.currentPlaceName = value.name;
          this.currentLatLon = value.latLon;
          this.filter.setLocationData(this.currentLatLon,value.maxDistance);
          this.logger.info(this, 'Current Place Name ', this.currentPlaceName);
          // Activate Distance Filter if No Other Filter is Applied
          if(value.fetchedLocation) {
            this.activateDistanceFilter();
          } else {
            this.currentPlaceName = '';
          }
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
        this.logger.info(this,"Fetching Stores From Server");
        this.currentFilter = data;
        if(this.currentFilter == FILTER_TYPES.MIN_AMOUNT) {
          this.filterString = "Min Amount";
        } else if(this.currentFilter == FILTER_TYPES.TOP_RATED) {
          this.filterString = "Top rated";
        } else if(this.currentFilter == FILTER_TYPES.CUSINE_FILTER) {
            this.filterString = "Cusines";
        } else {
          this.filterString = ''
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
            if (data !== undefined) {
              if(data.data) {
                this.toggleInfiniteScroll();
                this.sharedData.deleteData('filter');  
              }
            }
          });
        modal.present()
          .then(() => {
            loader.dismiss();
          });
      });
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.showFilters = false;
    });
  }

    // Banner resize fix
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.banner.ngOnInit();
    }
  
    // Fix for Footer
    ionViewDidEnter() {
      this.footer.setcurrentRoute('restaurant');
    }
  

  ngOnDestroy(): void {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
  }

}
