import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

export enum FILTER_TYPES {

  NO_FILTER,

  CATEGORY_WISE,
  DISTANCE_WISE, // This is the Default filter
  DELIVERY_TYPE,

  // Sort Types
  TOP_RATED,
  DELIVERY_TIME
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  // Change to FILTER_TYPES.DISTANCE_WISE
  private currentFilter = FILTER_TYPES.NO_FILTER;
  private filterBehaviour = new BehaviorSubject<any>(this.currentFilter);


  // For Location Based Search
  currentCordinates: any;
  distance = 25;
  private locationBehaviour = new BehaviorSubject<any>(this.currentCordinates);


  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger
  ) { }

  public getSubscription() {
    return this.filterBehaviour;
  }

  public getLocationSubscription() {
    return this.locationBehaviour;
  }

  public setCoordinates(latLon) {
    this.currentCordinates = latLon;
    this.locationBehaviour.next(latLon);
  }

  public setFilter(filter) {
    this.currentFilter = filter;
    this.filterBehaviour.next(filter);
  }

  public getFilter() {
    return this.currentFilter;
  }

  public getStores(pageNumber, success, error?) {
    console.log(this.currentFilter == FILTER_TYPES.TOP_RATED.valueOf());
    if (this.currentFilter == FILTER_TYPES.NO_FILTER.valueOf()) {
      this.logger.info('Finding All Stores');
      this.getStoreNoFilter(pageNumber, success, error);
    }
    else if (this.currentFilter == FILTER_TYPES.DELIVERY_TIME.valueOf()) {
      this.getStoreByDeliveryTime(pageNumber, success, error);
    }
    else if (this.currentFilter == FILTER_TYPES.DISTANCE_WISE.valueOf()) {
      this.logger.info('Finding Store By Distance and Location', this.distance);
      this.getStoreByDistance(pageNumber, success, error);
    }
    else if (this.currentFilter == FILTER_TYPES.TOP_RATED.valueOf()) {
      this.logger.info('Finding Store By Rating');
      this.getStoreByRating(pageNumber, success, error);
    } 
    else {

    }

  }

  private getStoreByDistance(pageNumber, success, error?) {
    this.logger.info('Getting STores Via Distance Filter');
    if (this.currentCordinates !== undefined) {
      this.locationBehaviour.next(this.currentCordinates);
      // this.queryResource
      // .searchByNearestLocationUsingGET({
      //   latLon: this.currentCordinates,
      //   kiloMeter: this.distance
      // })
      // .subscribe(data => {
      //   success(data.totalElements, data.totalPages, data.content);
      // },
      // err => {
      //   this.logger.error('Error Finding Store By Distance and Location' , err);
      // });
    }
  }

  private getStoreByRating(pageNumber, success, error?) {
    this.logger.info('Getting STores Via Rating Filter');
    this.queryResource.findStoreByRatingUsingGET(
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error('Error Finding Store By Distance', err);
        error();
      });
  }

  private getStoreNoFilter(pageNumber, success, error?) {
    this.logger.info('Getting STores Via No Filter');
    this.queryResource.findAllStoresUsingGET({
      page: pageNumber
    })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
        err => {
          this.logger.error('Error Finding Stores', err);
          error();
        });
  }

  private getStoreByDeliveryTime(pageNumber, success, error?) {
    this.logger.info('Getting STores Via Delivery Time Filter');
    this.queryResource.findAndSortStoreBydeliveryTimeUsingGET({
      page: pageNumber
    })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
        err => {
          this.logger.error('Error Finding Stores', err);
          error();
        });
  }

}
