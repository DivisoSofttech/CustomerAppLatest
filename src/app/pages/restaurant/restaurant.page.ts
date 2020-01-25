import { FilterService, FILTER_TYPES, FILTER_KEY } from './../../services/filter.service';
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

  private pageCount: number = 0;

  public stores: Store[] = [];

  public currentFilter: FILTER_TYPES;

  public currentFilterName: string = '';

  public location: LocationModel = {
    name: '',
    latLon: [],
    fetchedLocation: false
  }

  public isGuest: Boolean = false;

  public showFooter: Boolean = true;
  public showLoading: Boolean = true;
  public showFilters: Boolean = false;

  private keycloakSubscription: any;
  private backButtonSubscription: any;
  private filterSubscription: any;
  private locationSubscription: any;

  @ViewChild(IonInfiniteScroll, null) private ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher, null) private IonRefresher: IonRefresher;
  @ViewChild(FooterComponent, null) private footer: FooterComponent;
  @ViewChild(BannerComponent, null) private banner: BannerComponent;

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
    this.getLocationDetails();
    this.getFilterSubscription();
  }


  private checkIfGuest() {
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

  private getLocationDetails() {
    this.logger.info(this, 'Getting Current Location');
    this.locationSubscription = this.locationService.getLocation()
      .subscribe((location: LocationModel) => {
        if (location) {
          this.location = location;
          if (location.fetchedLocation) {
            if(this.location.updated) {
              this.filterService.activateDistanceFilter(this.location.latLon, this.location.maxDistance);
            } else {
              if(this.filterService.getCurrentFilter() === FILTER_TYPES.DISTANCE_WISE) {
                this.filterService.activateDistanceFilter(this.location.latLon, this.location.maxDistance);
              }
            }
            this.logger.info(this, 'Current Location Details', this.location);
            this.forceAngularChangeDetection();
          }
        }
      },
        err => {
          this.logger.error(this, 'Error Getting Current Location Data From Location Service');
        });
  }


  private setCurrentFilterName() {
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

  private getFilterSubscription() {
    this.filterSubscription = this.filterService.getFilterSubscription().subscribe((data) => {
      this.currentFilter = data.currentFilterType;
      this.ionInfiniteScroll.disabled = false;
      this.getStores();
    });
  }

  getStores() {
    this.showLoading = true;
    this.stores = [];
    this.setCurrentFilterName();
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
      this.forceAngularChangeDetection();
      this.toggleIonRefresher();
    },
      (err) => {
        this.errorService.showErrorModal(() => {
          this.filterSubscription.unsubscribe();
          this.getStores();
        });
      });
  }

  public searchBarActivated(event) {
    this.showFooter = event ? false : true;
  }


  public loadMoreStores(event) {
    this.logger.info(this, 'Load More Stores if exists');
    ++this.pageCount;
    this.filterService.getStores(this.pageCount, (totalElements, totalPages, stores) => {
      event.target.complete();
      this.logger.info(this, 'Got Stores Page :', this.pageCount, '----', stores);
      if (this.pageCount === totalPages) {
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

  public doRefresh(event) {
    this.pageCount = 0;
    this.filterSubscription.unsubscribe();
    this.logger.info(this, 'Refreshing Page');
    this.banner.refresh();
    this.getStores();
  }

  private toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }

  private toggleIonRefresher() {
    this.IonRefresher.complete();
  }

  public toggleFilterComponent(event) {
    if (event === 'close') {
      this.showFilters = false;
      this.footer.filterHide = false;
      this.footer.setcurrentRoute('restaurant');
    } else {
      this.showFilters = true;
      this.footer.filterHide = true;
    }
  }


  public async showPlaceSelectionModal() {
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
                this.sharedData.deleteData(FILTER_KEY);
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
  private nativebackButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.showFilters = false;
    });
  }

  // Fix Banner Size on Viewport Size Changed
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.banner.ngOnInit();
  }

  // Fix for Footer Active Tab Selection
  ionViewDidEnter() {
    this.footer.setcurrentRoute('restaurant');
  }

  // Invoke Angular Change Detection Manually.
  // Fix View Not Automatically Updated For Some Reason.
  private forceAngularChangeDetection() {
    if (!this.cdr['destroyed'])
      this.cdr.detectChanges();
  }

  // Unsubscribe from All Observables
  private unsubscribeAll() {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
    this.filterSubscription ? this.filterSubscription.unsubscribe() : null;
    this.keycloakSubscription ? this.keycloakSubscription.unsubscribe() : null;
    this.locationSubscription ? this.locationSubscription.unsubscribe() : null;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

}
