import { Component, OnInit } from '@angular/core';
import { Environment, GoogleMapOptions, GoogleMaps, MyLocation, GoogleMapsAnimation, GoogleMap, Marker } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  mapCanvas: GoogleMap;

  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyAwC9dPmp280b4C18RBcGWjInRi9NGxo5c',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyAwC9dPmp280b4C18RBcGWjInRi9NGxo5c'
    });

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 14,
        tilt: 30
      }
    };

    this.mapCanvas = GoogleMaps.create('map_canvas', mapOptions);
    this.mapCanvas
      .getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location, null, 2));

        // Move the map camera to the location with animation
        this.mapCanvas.animateCamera({
          target: location.latLng,
          zoom: 14,
          tilt: 30
        });
        const marker: Marker = this.mapCanvas.addMarkerSync({
          position: location.latLng,
          animation: GoogleMapsAnimation.DROP
        });
        marker.showInfoWindow();
      })
      .catch(err => {
        // this.util.createToast(err);
      });
  }

}
