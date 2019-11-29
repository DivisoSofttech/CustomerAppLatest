import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LocationService } from 'src/app/services/location-service';
import { ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { FilterService, FILTER_TYPES } from 'src/app/services/filter.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-place-suggestion',
  templateUrl: './place-suggestion.component.html',
  styleUrls: ['./place-suggestion.component.scss'],
})
export class PlaceSuggestionComponent implements OnInit , OnDestroy {

  places: any[] = [];

  @Input() currentPlaceName;

  showSpinner = false;

  searchTerm = '';

  recents = [];

  distance = 10;

  private unregisterBackAction: Subscription;

  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private modalController: ModalController,
    private sharedData: SharedDataService,
    private platform: Platform,
    private recentService: RecentService,
    private filter: FilterService
  ) { }

  ngOnInit() {
    this.getRecents();
    this.sharedData.getData('distance_filter')
    .then(data => {
      if(data !== null) {
        this.distance = data;
      }
    })
  }

  distanceChanged(event) {
    this.sharedData.saveToStorage('distance_filter' , this.distance);
    this.filter.distance = event.detail.value;
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
  }

  getRecents() {
    this.recentService.getRecentLocations()
    .subscribe(data => {
      this.logger.info('Found Recent Locations ' , data);
      if(data !== null) {
        this.recents = data;
      }
    })
  }

  saveToRecent(data) {
    this.recentService.saveRecent(data);
  }

  close() {
    this.modalController.dismiss();
  }

  closeCurrent() {
    this.modalController.dismiss({
      data: 'current'
    });
  }

  getPlacePredictions(event) {
    this.logger.info('Getting Place Suggestions' , event);
    this.places = [];
    this.searchTerm = event.detail.value;
    this.logger.info(event.detail.value);
    const searchterm = event.detail.value;
    if (searchterm === '' || searchterm === null) {
      return;
    } else {
      this.logger.info('Finding Places Searchterm ', searchterm);
      this.showSpinner = true;
      this.locationService.getPredictions(searchterm).subscribe(res => {
        this.logger.info('Got Place Suggestions', res);
        this.places = res;
        this.showSpinner=false;
      });  
    }
  }

  selectPlace(place) {
    this.logger.info('Place Selected', place);
    this.places = [];
    this.currentPlaceName = place.description;
    const found = this.recents.some(el => el.data.description === place.description);
    if(!found) {
      this.saveToRecent({data:place , type:RecentType.LOCATION});
    }
    this.logger.info('Getting LatLon for selected Location');
    this.locationService
      .geocodeAddress(place.place_id)
      .then(data => {
        this.logger.info('Found LatLon for selected Location', data);
        // Dismiss Data here
        this.filter.distance = this.distance;
        this.modalController.dismiss({
          latLon: data,
          name: this.currentPlaceName
        });
      })
      .catch(err => {
        this.logger.warn('Error Getting LatLon for selected Location', place);
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
 
  }


}
