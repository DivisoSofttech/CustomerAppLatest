import { StoreDTO } from './../../api/models/store-dto';
import { FilterService, FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, IonSlides } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss']
})
export class RestaurantPage implements OnInit {

  showLoading = true;

  showFilters = false;

  page = 0;

  stores: StoreDTO[] = [];

  @ViewChild(IonInfiniteScroll , null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher , null) IonRefresher: IonRefresher;
  @ViewChild(MapComponent , null) mapComponent: MapComponent;

  constructor(
    private filter: FilterService,
    private util: Util,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.getStores();
  }

  updatedLocation(event) {
    this.logger.info('Changed Current Location - LatLon ' , event);
    this.filter.currentCordinates = event.latLon;
    // this.logger.info('Setting Distance_wise Filter');
    // this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    // this.logger.info('Getting Stores');
  }

  getStores() {
    this.filter.getSubscription().subscribe(data => {
      this.stores = [];
      this.filter.getStores(0, (totalElements, totalPages, stores) => {
        if (totalPages === 1) {
          this.logger.info('Disabling Infinite Scroll');
          this.toggleInfiniteScroll();
        }
        this.logger.info('Got Stores ' , data);
        stores.forEach(s => {
          this.stores.push(s);
        });
        this.mapComponent.setStores(stores);
        this.showLoading = false;
        this.toggleIonRefresher();
      });
    });
  }

  loadMoreStores(event) {
    this.logger.info('Load More Stores if exists');
    this.page++;
    this.filter.getStores(this.page, (totalElements, totalPages, stores) => {
      if (this.page === totalPages) {
        this.toggleInfiniteScroll();
      }
      if (totalPages === 1) {
        this.toggleInfiniteScroll();
      } else {
        console.log(stores);
        stores.forEach(s => {
          this.stores.push(s);
        });
      }
    });
  }

  doRefresh(event) {
    this.logger.info('Refreshing Page');
    this.getStores();
  }

  toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }

  toggleIonRefresher() {
    this.IonRefresher.complete();
  }

  toggleFilteromponent() {
    this.showFilters = !this.showFilters;
  }
}
