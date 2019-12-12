
import { FilterService , FILTER_TYPES} from './../../services/filter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, ModalController} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { MapComponent } from 'src/app/components/map/map.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { PlaceSuggestionComponent } from 'src/app/components/place-suggestion/place-suggestion.component';
import { LocationService } from 'src/app/services/location-service';
import { ErrorService } from 'src/app/services/error.service';
import { Store } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';
import { KeycloakService } from 'src/app/services/security/keycloak.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss']
})
export class RestaurantPage implements OnInit {

  showLoading = true;

  showFilters = false;

  page = 0;

  stores: Store[] = [];

  currentPlaceName = '';

  currentFilter = FILTER_TYPES.DISTANCE_WISE;

  @ViewChild(IonInfiniteScroll, null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  @ViewChild(FooterComponent, null) footer: FooterComponent;

  keycloakSubscription: any;
  isGuest = false;



  constructor(
    private filter: FilterService,
    private util: Util,
    private logger: LogService,
    private modalController: ModalController,
    private locationService: LocationService,
    private errorService: ErrorService,
    private keycloakService: KeycloakService
  ) { }


  ngOnInit() {
    this.checkIfGuest();
    this.getCurrentLocation();
    this.getStores();
  }

  async getStores() {
    this.filter.getSubscription().subscribe(data => {
      this.currentFilter = data;
      this.showLoading = true;
      this.stores = [];
      this.toggleInfiniteScroll();
      this.filter.getStores(0, (totalElements, totalPages, stores) => {

        this.logger.info(this,'Got Stores ', stores);
        if (totalPages > 1) {
          this.logger.info(this,'Enabling Infinite Scroll');
          this.toggleInfiniteScroll();
        }
        this.stores = [];
        stores.forEach(s => {
          this.stores.push(s);
        });
        this.showLoading = false;
        this.logger.info(this,"Disabling Loader",this.showLoading);
        this.toggleIonRefresher();
      },
        () => {
          this.errorService.showErrorModal(this);
        });
    });
  }

  checkIfGuest() {
    this.keycloakSubscription = this.keycloakService.getUserGuestSubscription()
    .subscribe(data => {
      if(data !== null) {
        this.isGuest= data;
      } else {
        this.isGuest = true;
      }
    });
  }

  loadMoreStores(event) {
    this.logger.info(this,'Load More Stores if exists');
    ++this.page;
    this.filter.getStores(this.page, (totalElements, totalPages, stores) => {
      event.target.complete();
      this.logger.info(this,'Got Stores Page :', this.page,'----', stores ,);
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
    this.logger.info(this,'Refreshing Page');
    this.getStores();
  }

  toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }

  toggleIonRefresher() {
    this.logger.info(this,'Disableing Ion Refresher');
    this.IonRefresher.complete();
  }

  toggleFilteromponent(event) {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.logger.info(this,this,'Closed Filter');
      this.footer.setcurrentRoute('restaurant');
      this.footer.filterHide = false;
    } else {
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
            if(data !== undefined && data.data !== undefined) {
              this.toggleInfiniteScroll();
              if(data.data.currentLocation && data.data.locationChanged) {
                this.logger.info(this,'Setting Current Location ', data);
                this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
              } else if(!data.data.currentLocation && !data.data.distanceChanged) {
                this.logger.info(this,'Updating Current Location ' , data);
                this.updatedLocation(data);
              } else if(data.data.distanceChanged) {
                this.logger.info(this,'Distance Changed ', data);
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
    this.logger.info(this,'Changed Current Location - LatLon ', data);
    this.filter.setCoordinates(data.data.latLon);
    this.currentPlaceName = data.data.name;
    this.logger.info(this,'Setting Distance_wise Filter');
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    this.logger.info(this,'Getting Stores');
  }

  // Fix for Footer
  ionViewDidEnter() {
    this.footer.setcurrentRoute('restaurant');
  }

  async getCurrentLocation() {
    this.logger.info(this,'Getting Current Location');
    this.locationService.getLocation()
    .subscribe(value => {
      if(value !== null) {
        this.logger.info(this,'Fetching Stores for Address' , value);
        this.currentPlaceName = value.name;
        this.filter.setCoordinates(value.coords);
        this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
        this.logger.info(this,'Current Place Name ', this.currentPlaceName);
        this.logger.info(this,'Getting LatLon for current Location', value.coords);    
      }
    });
  }

}
