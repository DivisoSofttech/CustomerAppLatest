import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LocationService } from 'src/app/services/location-service';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { FilterService, FILTER_TYPES } from 'src/app/services/filter.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LogService } from 'src/app/services/log.service';

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

  oldDistance = 0;

  backButtonSubscription: any;

  constructor(
    private logger: LogService,
    private locationService: LocationService,
    private modalController: ModalController,
    private sharedData: SharedDataService,
    private recentService: RecentService,
    private filter: FilterService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.getRecents();
    this.sharedData.getData('distance_filter')
    .then(data => {
      if(data !== null) {
        this.distance = data;
        this.oldDistance = data;
      }
    })
    this.backButtonHandler();
  }

  ngOnDestroy(): void {
    this.backButtonSubscription?this.backButtonSubscription.unsubscribe():null;
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
     this.dismiss();
    });
  }

  distanceChanged(event) {
    this.sharedData.saveToStorage('distance_filter' , this.distance);
    this.filter.distance = event.detail.value;
  }

  getRecents() {
    this.recentService.getRecentLocations()
    .subscribe(data => {
      this.logger.info(this,'Found Recent Locations ' , data);
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
      currentLocation:true,
      distanceChanged:true,
      locationChanged: true
    });
  }

  getPlacePredictions(event) {
    if (event.detail.value.replace(/\s/g, '').length) {
      this.logger.info(this,'Getting Place Suggestions' , event);
      this.places = [];
      this.searchTerm = event.detail.value;
      this.logger.info(this,event.detail.value);
      const searchterm = event.detail.value;
      if (searchterm === '' || searchterm === null) {
        return;
      } else {
        this.logger.info(this,'Finding Places Searchterm ', searchterm);
        this.showSpinner = true;
        this.locationService.getPredictions(searchterm).subscribe(res => {
          this.logger.info(this,'Got Place Suggestions', res);
          this.places = res;
          this.logger.info(this,'Assigned Places', res);
          this.showSpinner=false;
          this.changeDetectorRef.detectChanges();
          this.logger.info(this,'Spinner Disabled' , this.showSpinner);
        });    
    }
    }
  }

  selectPlace(place) {
    this.logger.info(this,'Place Selected', place);
    this.places = [];
    this.currentPlaceName = place.description;
    const found = this.recents.some(el => el.data.description === place.description);
    if(!found) {
      this.saveToRecent({data:place , type:RecentType.LOCATION});
    }
    this.logger.info(this,'Getting LatLon for selected Location');
    this.locationService
      .geocodeAddress(place.place_id)
      .then(data => {
        this.logger.info(this,'Found LatLon for selected Location', data);
        // Dismiss Data here
        this.filter.distance = this.distance;
        this.sharedData.saveToStorage('location',{
          latLon: data,
          name: this.currentPlaceName,
          coords:data,
          currentLocation: false,
          distanceChanged: true,
          locationChanged: true
        })
        this.modalController.dismiss({
          latLon: data,
          name: this.currentPlaceName,
          currentLocation: false,
          distanceChanged: false,
          locationChanged: true
        });
      })
      .catch(err => {
        this.logger.warn('Error Getting LatLon for selected Location', place);
      });
  }
  
  getCurrentLocation() {
    this.locationService.getCurrentLoactionAddress((data,coords)=> {})    
    this.closeCurrent();
  }

  dismiss() {
    this.modalController.dismiss({
      distanceChanged: this.distance !== this.oldDistance?true:false,
      currentLocation: true,
      locationChanged: false
    });
  }

}
