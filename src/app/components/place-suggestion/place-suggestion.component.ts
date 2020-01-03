import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocationService, LocationModel } from 'src/app/services/location-service';
import { ModalController, Platform } from '@ionic/angular';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-place-suggestion',
  templateUrl: './place-suggestion.component.html',
  styleUrls: ['./place-suggestion.component.scss'],
})
export class PlaceSuggestionComponent implements OnInit , OnDestroy {


  searchTerm: string = '';

  places: any[] = [];

  recentPlaces: any[] = [];

  oldMaxDistance: number = 0;

  location: LocationModel = {
    latLon: [],
    name: '',
    maxDistance:0,
    fetchedLocation: false
  };


  showSpinner: boolean = false;

  backButtonSubscription: any;
  locationSubscription:any;
  recentPlacesSubscription:any;

  constructor(
    private locationService: LocationService,
    private recentService: RecentService,
    private logger: LogService,
    private modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.getRecentPlaces();
    this.getLocationDetails();
    this.nativeBackButtonHandler();
  }

  getRecentPlaces() {
    this.recentPlacesSubscription = this.recentService.getRecentLocations()
    .subscribe(data => {
      this.logger.info(this,'Found Recent Locations ' , data);
      if(data !== null) {
        this.recentPlaces = data;
      }
    },err => {
      this.logger.error(this,'Error Fetching Recents From Storage');
    })
  }

  getLocationDetails() {
    this.locationSubscription = this.locationService.getLocation()
    .subscribe((location: LocationModel)=>{
      this.location = location;
      this.oldMaxDistance = this.location.maxDistance;
    },
    err => {
      this.logger.error(this,'Error Fetching Location');
    })
  }

  saveToRecent(place) {
    const found = this.recentPlaces.some(el => el.data.description === place.description);
    if(!found) {
      this.recentService.saveRecent({data:place , type:RecentType.LOCATION});
    }
  }

  validateSearchTermAndSearch(event) {
    if (event.detail.value.replace(/\s/g, '').length) {
      this.places = [];
      this.searchTerm = event.detail.value;
      if (this.searchTerm === '' || this.searchTerm === null) {
        this.logger.info(this,'Invalid Search Term');
      } else {
        this.fetchPlaces();
      }
    }
  }

  fetchPlaces() {
    this.logger.info(this,'Finding Places Searchterm ', this.searchTerm);
    this.showSpinner = true;
    this.locationService.getPredictions(this.searchTerm).subscribe(res => {
      this.logger.info(this,'Got Place Suggestions', res);
      this.places = res;
      this.showSpinner=false;
      this.changeDetectorRef.detectChanges();
    },
    err => {
      this.logger.error(this,'Fetching Place Suggestion Error');
    });    
  }

  selectPlace(place) {
    this.logger.info(this,'Place Selected', place);
    this.places = [];
    this.location.name = place.description;
    this.saveToRecent(place);
    this.logger.info(this,'Getting LatLon for selected Location');
    this.locationService
      .geocodeAddress(place.place_id)
      .then(data => {
        this.logger.info(this,'Found LatLon for selected Location', data);
        this.locationService.setMaxDistance(this.location.maxDistance)
        this.location.latLon = data;
        this.dismiss(true,()=>{
          this.locationService.setPosition(this.location);
        });
      })
      .catch(err => {
        this.logger.error('Error Getting LatLon for selected Location', place);
      });
  }
  
  getCurrentLocation() {
    this.dismiss(true,()=>{
      this.location.fetchedLocation = false;
      this.locationService.setPosition(this.location);
      this.locationService.getCurrentLoactionAddress((data,coords)=> { })
    });   
  }


  dismiss(value = false , success?) {
    if(this.oldMaxDistance !== this.location.maxDistance) {
      this.modalController.dismiss(true)
      .then(()=>{
        this.locationService.setPosition(this.location);
      })
    } else {
      this.modalController.dismiss(value)
      .then(()=>{
        if(success) {
          success();
        }
      });  
    }
  }

  // BackButton Handler
  nativeBackButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
     this.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.backButtonSubscription?this.backButtonSubscription.unsubscribe():null;
    this.locationSubscription?this.locationSubscription.unsubscribe():null;
    this.recentPlacesSubscription?this.recentPlacesSubscription.unsubscribe():null;
  }

}
