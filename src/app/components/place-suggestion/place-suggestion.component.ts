import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LocationService } from 'src/app/services/location-service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-place-suggestion',
  templateUrl: './place-suggestion.component.html',
  styleUrls: ['./place-suggestion.component.scss'],
})
export class PlaceSuggestionComponent implements OnInit {

  places: any[] = [];

  currentPlaceName;

  showSpinner = false;


  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  getPlacePredictions(event) {
    this.logger.info('Getting Place Suggestions');
    this.places = [];
    this.showSpinner = true;
    this.logger.info(event.detail.value);
    const searchterm = event.detail.value;
    if (searchterm === '' || searchterm === null) {
      return;
    }

    this.locationService.getPredictions(searchterm).subscribe(res => {
      this.logger.info('Got Place Suggestions', res);
      this.places = res;
      this.showSpinner=false;
    });
  }

  selectPlace(place) {
    this.logger.info('Place Selected', place);
    this.places = [];
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


}
