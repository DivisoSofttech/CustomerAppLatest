import { Component, OnInit } from '@angular/core';
import {
  Environment,
  GoogleMapOptions,
  GoogleMaps,
  MyLocation,
  GoogleMapsAnimation,
  GoogleMap,
  Marker
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { FilterService } from 'src/app/services/filter.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  mapCanvas: GoogleMap;

  mapAlreadyLoaded = false;

  curentLocationMarker: Marker;

  constructor(
    private logger: NGXLogger,
    private platform: Platform,
    private filter: FilterService, // Filter Service Contains the current latlon of the current
    private util: Util             // or selected location
  ) {}

  ngOnInit() {
    this.platform.ready().then(data => {
      if (data === 'cordova') {
       this.getLatLon();
      }
    });
  }


  loadMap(coords: string) {
    // This code is necessary for browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyAwC9dPmp280b4C18RBcGWjInRi9NGxo5c',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyAwC9dPmp280b4C18RBcGWjInRi9NGxo5c'
    });

    console.log('Map lat' , coords.substring(0, coords.indexOf(',')));

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: parseFloat(coords.substring(0, coords.indexOf(','))),
          lng: parseFloat(coords.substring(coords.indexOf(',') + 1 , coords.length))
        },
        zoom: 14,
        tilt: 30
      }
    };

    this.mapCanvas = GoogleMaps.create('map_canvas', mapOptions);
    this.logger.info('Setting Marker' , location);
    this.setCurrentLocationMarker(coords);
  }

  updateMap(coords: string) {
    this.logger.info('Updating Location' , coords);
    this.logger.info('Updating Location Latitude ', parseFloat(coords.substring(0, coords.indexOf(','))));
    this.logger.info('Updating Location Longitude' , parseFloat(coords.substring(coords.indexOf(',') + 1 , coords.length)));
    const GOOGLE = {
      lat: parseFloat(coords.substring(0, coords.indexOf(','))),
      lng: parseFloat(coords.substring(coords.indexOf(',') + 1 , coords.length))
    };

    this.setCurrentLocationMarker(GOOGLE);
  }

  setCurrentLocationMarker(coords) {
    this.logger.info('Setting Marker' , coords);
    if (this.curentLocationMarker !== undefined) {
      this.logger.info('Removing Old Marker' , coords);
      this.curentLocationMarker.remove();
    }
    this.mapCanvas.animateCamera({
      target: {
        latLng: coords,
        zoom: 14,
        tilt: 30
      }
    });
    // this.curentLocationMarker = this.mapCanvas.addMarkerSync({
    //   position: {
    //     lat: parseFloat(coords.substring(0, coords.indexOf(','))),
    //     lng: parseFloat(coords.substring(coords.indexOf(',') + 1 , coords.length))
    //   },
    //   animation: GoogleMapsAnimation.DROP
    // });
    // this.curentLocationMarker.showInfoWindow();
  }

  // App Specific Methods

  getLatLon() {
    this.filter.getLocationSubscription().subscribe(coords => {
      if (coords !== undefined) {
        if (this.mapAlreadyLoaded === false) {
          this.loadMap(coords);
          this.mapAlreadyLoaded = true;
        } else {
          this.updateMap(coords);
        }
      }
    });
  }

  setStores(stores) {
    console.log(stores);
  }

  clearStores() {

  }
}
