import { LocationService } from './../../services/location-service';
import { Component, OnInit, Input } from '@angular/core';
import {
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsAnimation,
  GoogleMap,
  Marker,
  LatLng
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';
import { Store } from 'src/app/api/models';
import { LocationModel } from 'src/app/models/location-model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  mapCanvas: GoogleMap;

  mapAlreadyLoaded = false;

  curentLocationMarker: Marker;

  storeLocationMarkers: Marker[] = [];

  @Input() showActiveLocation = true;

  @Input() coords ='';

  constructor(
    private logger: NGXLogger,
    private platform: Platform,
    private util: Util, // or selected location,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.initLoadMap();
  }

  initLoadMap() {
    this.platform.ready().then(data => {
      if (this.platform.is('cordova' || 'android' || 'ios')) {
        this.logger.info('Map component getting LatLon');
        if (this.showActiveLocation === true) {
          this.getLatLon();
        } else {
          this.loadMap(this.coords);
        }
      }
    });
  }

  getLatLon() {
    this.locationService.getLocation().subscribe((locationModel: LocationModel) => {
      if (locationModel !== undefined) {
        if (this.mapAlreadyLoaded === false) {
          this.loadMap(locationModel.latLon);
          this.mapAlreadyLoaded = true;
        } else {
          this.updateMap(locationModel.latLon);
        }
      } else {
        this.locationService.getCurrentLocation().then(latlon => {
          this.loadMap(latlon.coords.latitude + ',' + latlon.coords.longitude);
          this.mapAlreadyLoaded = true;
        });
      }
    });
  }

  loadMap(coords) {
    this.platform.ready().then(data => {
      if (this.platform.is('cordova' || 'android' || 'ios')) {
        if (coords !== undefined && coords !== null) {
          this.logger.info('Loading Maps', coords);
          const latlngArr = coords.split(',');
          const latLng: LatLng = new LatLng(
            parseFloat(latlngArr[0]),
            parseFloat(latlngArr[1])
          );
          const mapOptions: GoogleMapOptions = {
            camera: {
              zoom: 14,
              tilt: 30
            }
          };
          this.mapCanvas = GoogleMaps.create('map_canvas', mapOptions);
          this.logger.info('Setting Marker', mapOptions);
          this.setCurrentLocationMarker(latLng);
        }
      }
    });
  }

  async updateMap(coords) {
    if (!this.mapCanvas) {
      await this.initLoadMap();
    }
    this.logger.info('Updating Maps');
    this.logger.info('Updating Location', coords);
    const latlngArr = coords.split(',');
    const latLng: LatLng = new LatLng(
      parseFloat(latlngArr[0]),
      parseFloat(latlngArr[1])
    );
    this.setCurrentLocationMarker(latLng);
  }

  async setCurrentLocationMarker(latLng) {
    if (!this.mapCanvas) {
      await this.initLoadMap();
    }
    this.logger.info('Setting Marker', latLng);
    if (this.curentLocationMarker !== undefined) {
      this.logger.info('Removing Old Marker', latLng);
      this.curentLocationMarker.remove();
    }
    this.mapCanvas.animateCamera({
      target: latLng,
      zoom: 14,
      tilt: 30
    });
    if (this.showActiveLocation === true) {
      this.curentLocationMarker = this.mapCanvas.addMarkerSync({
        position: latLng,
        animation: GoogleMapsAnimation.DROP
      });
    } else {
      this.curentLocationMarker = this.mapCanvas.addMarkerSync({
        icon: 'assets/icon/marker.png',
        position: latLng,
        animation: GoogleMapsAnimation.DROP
      });
    }
    this.curentLocationMarker.showInfoWindow();
  }

  setStoreLocationMarkers(stores: Store[]) {
    console.log('inside store markers ', this.mapCanvas);
    this.platform.ready().then(async data => {
      if (this.mapCanvas === undefined) {
        await this.initLoadMap();
      }
      if (this.platform.is('cordova' || 'android' || 'ios')) {
        stores.forEach(s => {
          if (s.location !== undefined && s.location !== null) {
            const latlngArr = s.location.split(',');
            const latLng: LatLng = new LatLng(
              parseFloat(latlngArr[0]),
              parseFloat(latlngArr[1])
            );
            const i = this.storeLocationMarkers.length;
            this.storeLocationMarkers[i] = this.mapCanvas.addMarkerSync({
              icon: 'assets/icon/marker.png',
              position: latLng,
              animation: GoogleMapsAnimation.DROP
            });
            this.curentLocationMarker.showInfoWindow();
          }
        });
      }
    });
  }

  removeStoreLocationMarkers() {
    this.storeLocationMarkers.forEach(sm => {
      sm.remove();
    });
  }
}
