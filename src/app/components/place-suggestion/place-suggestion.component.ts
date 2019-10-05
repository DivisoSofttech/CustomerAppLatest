import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LocationService } from 'src/app/services/location-service';
import { ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-suggestion',
  templateUrl: './place-suggestion.component.html',
  styleUrls: ['./place-suggestion.component.scss'],
})
export class PlaceSuggestionComponent implements OnInit , OnDestroy {

  recentPlaces = [];

  places: any[] = [];

  @Input() currentPlaceName;

  showSpinner = false;

  recentPlaceKey = 'recentPlaces';

  searchTerm = '';

  private unregisterBackAction: Subscription;

  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private modalController: ModalController,
    private storage: Storage,
    private platform: Platform
  ) { }

  ngOnInit() {

    this.storage.get(this.recentPlaceKey)
    .then(data => {
      if(data !== null) {
        this.recentPlaces = data.reverse();
      } else {
        this.logger.info('Adding Recent Places');
        this.storage.set(this.recentPlaceKey , []);
      }
    });
  }

  // closeModalOnBack() {
  //   this.unregisterBackAction = this.platform.backButton.(() => {
  //     this.modalController.dismiss();
  // })
  // }

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
    this.storage.get(this.recentPlaceKey)
    .then((data: any[]) => {
      if(!data.some(p => p.id === place.id)) {
        this.logger.info('Adding To Recnet Places' , data.some(p => p.id === place.id));
        data.push(place);
        this.recentPlaces = data.reverse();
        this.storage.set(this.recentPlaceKey , data);
      } else {
        this.logger.info('Already Exists On Recnet Places');
      }
    });
    this.currentPlaceName = place.description;
    this.logger.info('Getting LatLon for selected Location');
    this.locationService
      .geocodeAddress(place.place_id)
      .then(data => {
        this.logger.info('Found LatLon for selected Location', data);
        // Dismiss Data here
        this.modalController.dismiss({
          latLon: data,
          name: this.currentPlaceName
        });
      })
      .catch(err => {
        this.logger.warn('Error Getting LatLon for selected Location', place);
      });
  }

  ngOnDestroy() {
 
  }


}
