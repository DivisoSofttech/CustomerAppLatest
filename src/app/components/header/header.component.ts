import { NotificationComponent } from 'src/app/components/notification/notification.component';
import {
  IonInfiniteScroll,
  IonSearchbar,
  ModalController
} from '@ionic/angular';
import { Store } from './../../api/models/store';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { LocationService } from './../../services/location-service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Emitted When Place is Changed
  @Output() placeChanged = new EventEmitter();

  places: any[] = [];

  currentPlaceName = 'Getting Current Position';

  storeSearchResults: Store[] = [];

  showSearchBar = false;

  showPlaceSearch = false;

  showSearchPane = false;

  showLoading = false;

  searchTerm = '';

  pageCount = 0;

  loader: HTMLIonLoadingElement;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  @ViewChild('restaurantSearch', null) restaurantSearch: IonSearchbar;
  @ViewChild('placeSearch', null) placeSearch: IonSearchbar;

  constructor(
    private locationService: LocationService,
    private queryResource: QueryResourceService,
    private util: Util,
    private logger: NGXLogger,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.logger.info('Initializing', HeaderComponent.name);
    this.getCurrentLocation();
  }

  toggleSearchBar() {
    this.logger.info('SearchBar Toggled - View', this.showSearchBar);
    this.showPlaceSearch = false;
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    if (this.showSearchBar === true) {
      this.restaurantSearch.setFocus();
    }
  }

  togglePlaceSearch() {
    this.logger.info('PlaceSearch Toggled - View', this.showPlaceSearch);
    this.showSearchBar = false;
    this.showPlaceSearch = !this.showPlaceSearch;
    if (this.showPlaceSearch === true) {
      this.placeSearch.setFocus();
    }
  }

  toggleInfiniteScroll() {
    this.logger.info('InfiniteScroll Toggled ', this.infiniteScroll.disabled);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  selectPlace(place) {
    this.logger.info('Place Selected', place);
    this.togglePlaceSearch();
    this.places = [];
    this.currentPlaceName = place.description;
    this.logger.info('Getting LatLon for selected Location');
    this.locationService
      .geocodeAddress(place.place_id)
      .then(data => {
        this.logger.info('Found LatLon for selected Location', data);
        this.placeChanged.emit({ latLon: data[0] + ',' + data[1] });
      })
      .catch(err => {
        this.logger.warn('Error Getting LatLon for selected Location', place);
      });
  }

  // Get Current Location
  getCurrentLocation() {
    this.logger.info('Getting Current Location');
    this.locationService.getCurrentLoactionAddress((data, coords) => {
      this.currentPlaceName = data[0].address_components[0].short_name;
      this.logger.info('Current Place Name ', this.currentPlaceName);
      this.logger.info('Getting LatLon for current Location', coords);
      this.placeChanged.emit({
        latLon: coords.coords.latitude + ',' + coords.coords.longitude
      });
    });
  }

  getPlacePredictions(event) {
    this.logger.info('Getting Place Suggestions');
    this.places = [];
    this.logger.info(event.detail.value);
    const searchterm = event.detail.value;
    if (searchterm === '' || searchterm === null) {
      return;
    }
    this.locationService.getPredictions(searchterm).subscribe(res => {
      this.logger.info('Got Place Suggestions', res);
      this.places = res;
    });
  }

  getSearchResults(i) {
    this.queryResource
      .headerUsingGET({
        searchTerm: this.searchTerm,
        page: 0
      })
      .subscribe(
        result => {
          this.showLoading = false;
          if (result.content.length === 0) {
            return;
          } else {
            ++i;
            if (result.totalPages === i) {
              this.toggleInfiniteScroll();
            }
            result.content.forEach(s => {
              this.storeSearchResults.push(s);
            });
          }
        },
        err => {
          this.showLoading = false;
        }
      );
  }

  search(event) {
    this.showLoading = true;
    this.logger.info('Getting Restaurants By Name');
    this.searchTerm = event.detail.value;
    this.storeSearchResults = [];
    this.getSearchResults(0);
  }

  loadMoreData(event) {
    this.logger.info('Loading More Data');
    this.pageCount++;
    this.getSearchResults(this.pageCount);
  }

  async showNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      componentProps: { type: 'full' }
    });
    modal.present();
  }
}
