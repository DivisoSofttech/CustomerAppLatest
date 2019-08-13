import { StoreDTO } from './../../api/models/store-dto';
import { FilterService, FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, IonSlides } from '@ionic/angular';

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

  constructor(
    private filter: FilterService,
    private util: Util
  ) {}

  ngOnInit() {
    this.getStores();
  }

  updatedLocation(event) {
    console.log('Location Changed',event);
    this.filter.currentCordinates = event.latLon;
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE); 
  }

  getStores() {
    this.filter.getSubscription().subscribe(data => {
      console.log(data);
      this.stores = [];
      this.filter.getStores(0, (totalElements, totalPages, stores) => {
        if (totalPages === 1) {
          console.log('Disabling Infinite Scroll');
          this.toggleInfiniteScroll();
        }
        console.log(stores);
        stores.forEach(s => {
          this.stores.push(s);
        });
        this.showLoading = false;
        this.toggleIonRefresher();
      });
    });
  }

  loadMoreStores(event) {
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
