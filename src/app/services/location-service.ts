import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  autoCompleteService: any;

  private currentLat: number;
  private currentLon: number;
  private geocoder: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private mapsWrapper: GoogleMapsAPIWrapper,
    private geolocation: Geolocation
  ) {
    console.log('Constror service location');
    this.mapsAPILoader.load().then(() => {
      this.autoCompleteService = new google.maps.places.AutocompleteService();
    });
  }

  calculateDistance(from: any, to: any): number {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      from,
      to
    );
    return distance;
  }

  getCurrentLocation() {
    return this.geolocation.getCurrentPosition();
  }

  getPredictions(searchTerm: string): Observable<any[]> {
    console.log('In the service location ');
    return new Observable(observer => {
      this.autoCompleteService.getPlacePredictions(
        { input: searchTerm },
        data => {
          let previousData: Array<any[]>;
          if (data) {
            console.log(data);
            previousData = data;
            observer.next(data);
            observer.complete();
          }

          if (!data) {
            console.log('PreviousData: ');
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
    this.geocoder.geocode({placeId}, async (results, status) => {
      if (status !== 'OK') {
        console.log('Geocoder failed due to: ' + status);
        return;
      }
      latlon = [
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
      ];
      console.log(latlon);
      console.log('Lat is inside geo ' + results[0].geometry.location.lat());
      console.log('Lon is inside geo ' + results[0].geometry.location.lng());
      resolve(latlon);
      });
    });
  }

  async getCurrentLoactionAddress(func) {
    console.log('I am working');
    return this.getCurrentLocation()
    .then(data => {
      console.log(data);
      const latLng = data.coords.latitude + ',' + data.coords.longitude;
      this.mapsAPILoader.load()
      .then(() => {
        let google_map_pos = new google.maps.LatLng( data.coords.latitude, data.coords.longitude );
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode(
        {latLng: google_map_pos},
        function( results, status ) {
          console.log(results);
          func(results , data);
        });
      });

    });

  }
}
