import { FilterService, FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, ModalController, Platform } from '@ionic/angular';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { PlaceSuggestionComponent } from 'src/app/components/place-suggestion/place-suggestion.component';
import { LocationService, LocationModel } from 'src/app/services/location-service';
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

  page: number = 0;

  stores: Store[] = [];

  currentFilter: FILTER_TYPES;
  currentFilterName: string = '';

  location: LocationModel = {
    name: '',
    latLon: [],
    fetchedLocation: false
  }

  isGuest: Boolean = false;

  showFooter: Boolean = true;
  showLoading: Boolean = true;
  showFilters: Boolean = false;

  keycloakSubscription: any;
  backButtonSubscription: any;
  filterSubscription: any;
  locationSubscription: any;

  @ViewChild(IonInfiniteScroll, null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  @ViewChild(FooterComponent, null) footer: FooterComponent;
  @ViewChild(BannerComponent, null) banner: BannerComponent;

  constructor(
    private filterService: FilterService,
    private locationService: LocationService,
    private utilService: Util,
    private errorService: ErrorService,
    private keycloakService: KeycloakService,
    private logger: LogService,
    private sharedData: SharedDataService,
    private modalController: ModalController,
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.nativebackButtonHandler();
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
    this.locationSubscription = this.locationService.getLocation()
      .subscribe((location: LocationModel) => {
        if (location) {
          this.location = location;
          this.filterService.setLocationFilterData(this.location.latLon, this.location.maxDistance);
          this.logger.info(this, 'Current Place Name ', this.location.name);
          // Activate Distance Filter if No Other Filter is Applied
          if (this.location.fetchedLocation) {
            this.activateDistanceFilter();
          }
        }
      },
      err => {
          this.logger.error(this, 'Error Getting Current Location Data From Location Service');
    });
  }

  activateDistanceFilter() {
    this.sharedData.getData('filter')
      .then(data => {
        if (!data) {
          this.logger.info(this, 'Setting DISTANCE_WISE Filter');
          this.filterService.setCurrentFilter(FILTER_TYPES.DISTANCE_WISE);
        }
      })
  }

  setCurrentFilterName() {
    if (this.currentFilter == FILTER_TYPES.MIN_AMOUNT) {
      this.currentFilterName = "Min Amount";
    } else if (this.currentFilter == FILTER_TYPES.TOP_RATED) {
      this.currentFilterName = "Top rated";
    } else if (this.currentFilter == FILTER_TYPES.CUSINE_FILTER) {
      this.currentFilterName = "Cusines";
    } else {
      this.currentFilterName = ''
    }
  }


  getStores() {
    this.filterSubscription = this.filterService.getFilterSubscription().subscribe((data: FILTER_TYPES) => {
      if (data) {
        this.showLoading = true;
        this.stores = [];
        this.currentFilter = data;
        this.forceAngularChangeDetection();
        this.setCurrentFilterName();
        this.toggleInfiniteScroll();
        this.filterService.getStores(0, (totalElements, totalPages, stores) => {
          this.stores = [];
          this.logger.info(this, 'Got Stores ', stores);
          this.logger.info(this, 'Total Pages', totalPages);
          this.logger.info(this, 'Total Elements', totalElements);
          if (totalPages > 1) {
            this.toggleInfiniteScroll();
          }
          stores.forEach(s => {
            this.stores.push(s);
          });
          this.showLoading = false;
          this.toggleIonRefresher();
          this.forceAngularChangeDetection();
        },
          (err) => {
            this.errorService.showErrorModal(() => {
              this.filterSubscription.unsubscribe();
              this.getStores();
            });
          });
      }
    });
  }

  searchBarActivated(event) {
    this.showFooter = event ? false : true;
  }


  loadMoreStores(event) {
    this.logger.info(this, 'Load More Stores if exists');
    ++this.page;
    this.filterService.getStores(this.page, (totalElements, totalPages, stores) => {
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
    this.utilService.createLoader()
      .then(async loader => {
        loader.present();
        const modal = await this.modalController.create(
          {
            component: PlaceSuggestionComponent,
          }
        );
        modal.onDidDismiss()
          .then(data => {
            if (data !== undefined) {
              if (data.data) {
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

  // Hide Filter when backbutton is pressed
  nativebackButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.showFilters = false;
    });
  }

  // Fix Banner Size on Viewport Size Changed
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.banner.ngOnInit();
  }

  // Fix for Footer Active Tab Selection
  ionViewDidEnter() {
    this.footer.setcurrentRoute('restaurant');
  }

  // Invoke Angular Change Detection Manually.
  // Fix View Not Automatically Updated For Some Reason.
  forceAngularChangeDetection() {
    if (!this.cdr['destroyed'])
      this.cdr.detectChanges();
  }

  // Unsubscribe from All Observables
  unsubscribeAll() {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
    this.filterSubscription ? this.filterSubscription.unsubscribe() : null;
    this.keycloakSubscription ? this.keycloakSubscription.unsubscribe() : null;
    this.locationSubscription ? this.locationSubscription.unsubscribe(): null;
  }

  ngOnDestroy(): void {
   this.unsubscribeAll();
  }

}
