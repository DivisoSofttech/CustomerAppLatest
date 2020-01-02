import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocationService } from 'src/app/services/location-service';
import { ModalController, Platform } from '@ionic/angular';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { LogService } from 'src/app/services/log.service';
import { LocationModel } from 'src/app/models/location-model';

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

  oldMaxDistance = 0;

  backButtonSubscription: any;

  locationSubscription:any;

  locationModel: LocationModel = {
    latLon: [],
    name: '',
    maxDistance:0,
    fetchedLocation: false
  };

  constructor(
    private logger: LogService,
    private locationService: LocationService,
    private modalController: ModalController,
    private recentService: RecentService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.getRecents();
    this.getLocationDetails();
    this.backButtonHandler();
  }

  ngOnDestroy(): void {
    this.backButtonSubscription?this.backButtonSubscription.unsubscribe():null;
    this.locationSubscription?this.locationSubscription.unsubscribe():null;
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
     this.dismiss();
    });
  }

  getLocationDetails() {
    this.locationSubscription = this.locationService.getLocation()
    .subscribe((location: LocationModel)=>{
      this.locationModel = location;
      this.oldMaxDistance = this.locationModel.maxDistance;
    })
  }

  distanceChanged(event) {
    this.locationModel.maxDistance = event.detail.value;
    this.locationService.setMaxDistance(this.locationModel.maxDistance);
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
        this.locationService.setMaxDistance(this.locationModel.maxDistance)
        this.locationModel.latLon = data;
        this.locationModel.name = this.currentPlaceName;
        this.dismiss(true,()=>{
          this.locationService.setPosition(this.locationModel);
        });
       
      })
      .catch(err => {
        this.logger.warn('Error Getting LatLon for selected Location', place);
      });
  }
  
  getCurrentLocation() {
    this.dismiss(true,()=>{
      this.locationModel.fetchedLocation = false;
      this.locationService.setPosition(this.locationModel);
      this.locationService.getCurrentLoactionAddress((data,coords)=> { })
    });   
  }


  dismiss(value = false , success?) {
    this.modalController.dismiss(value)
    .then(()=>{
      if(success) {
        success();
      }
    });
  }

  dismissDistanceChanged() {
  
    if(this.oldMaxDistance !== this.locationModel.maxDistance) {
      this.dismiss(true,()=>{
        this.locationService.setPosition(this.locationModel);
      });
    } else {
      this.dismiss(false);
    }
    
  }

}
