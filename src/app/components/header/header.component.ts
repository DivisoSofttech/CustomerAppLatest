import { IonInfiniteScroll } from '@ionic/angular';
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

  searchTerm = '';

  pageCount = 0;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;

  constructor(
    private locationService: LocationService,
    private queryResource: QueryResourceService,
    private util: Util
  ) {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  toggleSearchBar() {
    this.showPlaceSearch = false;
    this.showSearchBar = !this.showSearchBar;
  }

  togglePlaceSearch() {
    this.showSearchBar = false;
    this.showPlaceSearch = !this.showPlaceSearch;
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  selectPlace(place) {
    this.togglePlaceSearch();
    this.places = [];
    this.currentPlaceName = place.description;

    this.locationService.geocodeAddress(place.place_id).then(data => {
      // Emit latLon Here
      console.log(data);
      this.placeChanged.emit({ latLon: data[0] + '' + data[1] });
    });
  }

  // Get Current Location
  getCurrentLocation() {
    this.locationService.getCurrentLoactionAddress((data,coords) => {
      console.log(data[0].address_components[0].short_name);
      this.currentPlaceName = data[0].address_components[0].short_name;
      console.log(this.currentPlaceName);
      // Emit Real Latlon HerelatLon Here
      console.log('Current Coordinates' , coords);
      this.placeChanged.emit({ latLon: coords.coords.latitude + ',' + coords.coords.longitude });
    });
  }

  getPlacePredictions(event) {
    this.places = [];
    console.log(event.detail.value);
    const searchterm = event.detail.value;
    if (searchterm === '' || searchterm === null) {
      return;
    }
    this.locationService.getPredictions(searchterm).subscribe(res => {
      console.log(res);
      this.places = res;
    });
  }

  getRestaurantsByName(i) {
    this.queryResource
      .findStoreBySearchTermUsingGET({
        searchTerm: this.searchTerm,
        page: 0
      })
      .subscribe(result => {
        console.log(result.content);
        if (result.content.length === 0) {
          this.util.createToast('Sorry, couldn\'t find any match');
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
      });
  }

  searchRestaurants(event) {
    this.searchTerm = event.detail.value;
    this.storeSearchResults = [];
    this.getRestaurantsByName(0);
  }

  loadMoreData() {
    this.pageCount++;
    this.getRestaurantsByName(this.pageCount);
  }
}
