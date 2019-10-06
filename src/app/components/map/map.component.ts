import { Component, OnInit, Input } from '@angular/core';
import {
  Environment,
  GoogleMapOptions,
  GoogleMaps,
  MyLocation,
  GoogleMapsAnimation,
  GoogleMap,
  Marker,
  LatLng
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { FilterService } from 'src/app/services/filter.service';
import { NGXLogger } from 'ngx-logger';
import { Store } from 'src/app/api/models';

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

  constructor(
    private logger: NGXLogger,
    private platform: Platform,
    private filter: FilterService, // Filter Service Contains the current latlon of the current
    private util: Util // or selected location
  ) {}

  ngOnInit() {
    this.initLoadMap();
  }

  initLoadMap() {
    this.platform.ready().then(data => {
      if (data === 'cordova') {
        this.logger.info('Map component getting LatLon');
        if (this.showActiveLocation === true) {
          this.getLatLon();
        }
      }
    });
  }

  getLatLon() {
    this.filter.getLocationSubscription().subscribe(coords => {
      this.logger.info('Got Coordinates ', coords);
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

  loadMap(coords) {
    this.platform.ready().then(data => {
      if (data === 'cordova') {
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
          // this.setCurrentLocationMarker(latLng);
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
    this.platform.ready().then(async data => {
      if (!this.mapCanvas) {
        await this.initLoadMap();
      }
      if (data === 'cordova') {
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
