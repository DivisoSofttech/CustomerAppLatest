import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader } from '@agm/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedDataService } from './shared-data.service';
import { LogService } from './log.service';
import { LocationModel } from '../models/location-model';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private autoCompleteService: any;
  private geocoder: any;
  private positionAddressObservable: BehaviorSubject<LocationModel> = new BehaviorSubject<LocationModel>(null);
  private locationModel: LocationModel = {
    name:'',
    latLon: [],
    fetchedLocation: false,
    maxDistance: 25
  }
  

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private geolocation: Geolocation,
    private logger: LogService,
    private sharedData: SharedDataService
  ) {
    this.logger.info(this, 'Location Service Created');
    this.initMapsApi();
  }

  initMapsApi() {
    this.mapsAPILoader.load().then(() => {
      this.autoCompleteService = new google.maps.places.AutocompleteService();
      this.initLocation();
    });
  }

  initLocation() {
    this.sharedData.getData('location')
    .then((location: LocationModel) => {
      if (location !== null) {
          this.logger.info(this, "Fetching Existing Location From Storage");
          this.positionAddressObservable.next(location)
      } else {
        this.logger.info(this, "Fetching Current Location");
        this.getCurrentLoactionAddress((data, coords) => { })
      }
    });
  }

  calculateDistance(from: any, to: any): number {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(from,to);
    return distance;
  }

  setPosition(locationModel) {
    this.saveServiceDetailsToStorage(locationModel);
    this.positionAddressObservable.next(locationModel);
  }

  getPredictions(searchTerm: string): Observable<any[]> {
    this.logger.info(this, 'Getting Predictions');
    return new Observable(observer => {
      this.autoCompleteService.getPlacePredictions(
        { input: searchTerm },
        data => {
          let previousData: Array<any[]>;
          if (data) {
            previousData = data;
            observer.next(data);
            observer.complete();
          }

          if (!data) {
            observer.next(previousData);
            observer.complete();
          } else {
            observer.error(status);
          }
        }
      );
    });
  }

  async geocodeAddress(placeId: string): Promise<number[]> {

    return new Promise<number[]>((resolve, reject) => {
      let latlon: number[];
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({ placeId }, async (results, status) => {
        if (status !== 'OK') {
          this.logger.error(this, 'Geocoder failed due to: ' + status);
          return;
        }
        latlon = [
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        ];
        resolve(latlon);
      });
    });
  }

  getCurrentLocation() {
    return this.geolocation.getCurrentPosition();
  }

  async getCurrentLoactionAddress(func) {
    return this.getCurrentLocation()
      .then(latData => {
        const latLng = latData.coords.latitude + ',' + latData.coords.longitude;
        this.mapsAPILoader.load()
          .then(() => {
            const googleMapPos = new google.maps.LatLng(latData.coords.latitude, latData.coords.longitude);
            this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode(
              { latLng: googleMapPos },
              (results, status) => {
                this.logger.info(this, 'Locations All', results);
                this.logger.info(this, 'Location Adress ', results[0].address_components[0].short_name);
                let address = '';
                results[0].address_components.forEach((addr, i) => {
                  if (i < (results[0].address_components.length - 1)) {
                    address = address + addr.short_name + ',';
                  } else {
                    address = address + addr.short_name;
                  }
                });

                this.locationModel = {
                  maxDistance: 25,
                  latLon: [latData.coords.latitude, latData.coords.longitude],
                  name: address,
                  fetchedLocation: true
                }
                this.saveServiceDetailsToStorage(this.locationModel);
                this.positionAddressObservable.next(this.locationModel);
                func(results, latData);

              });
          });

      });
  }

  getLocation() {
    return this.positionAddressObservable;
  }


  getMaxDistance() {
    return this.locationModel.maxDistance;
  }

  setMaxDistance(value) {
    this.locationModel.maxDistance;
  }

  saveServiceDetailsToStorage(locationModel: LocationModel) {
    this.sharedData.saveToStorage('location',locationModel);
  }

}
