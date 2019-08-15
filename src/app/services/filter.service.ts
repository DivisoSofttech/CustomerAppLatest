import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

export enum FILTER_TYPES {
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

  private currentFilter = FILTER_TYPES.DISTANCE_WISE;
  private filterBehaviour = new BehaviorSubject<any>(this.currentFilter);


  // For Location Based Search
  currentCordinates: any;
  distance = 25;
  private locationBehaviour = new BehaviorSubject<any>(this.currentCordinates);


  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger
  ) {}

  public getSubscription() {
    return this.filterBehaviour;
  }

  public getLocationSubscription() {
    return this.locationBehaviour;
  }

  public setFilter(filter) {
    this.currentFilter = filter;
    this.filterBehaviour.next(filter);
  }

  public getFilter() {
    return this.currentFilter;
  }

  public getStores(pageNumber, success) {
    switch (this.currentFilter) {
      case FILTER_TYPES.DISTANCE_WISE:
        this.logger.info('Finding Store By Distance and Location' , this.distance);
        this.getStoreByDistance(pageNumber, success);
        break;
      case FILTER_TYPES.TOP_RATED:
        this.logger.info('Finding Store By Rating');
        this.getStoreByRating(pageNumber, success);
        break;
    }
  }

  private getStoreByDistance(pageNumber, success) {
    if(this.currentCordinates !== undefined) {
      this.locationBehaviour.next(this.currentCordinates);
      this.queryResource
      .searchByNearestLocationUsingGET({
        latLon: this.currentCordinates,
        kiloMeter: this.distance
      })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
      err => {
        this.logger.error('Error Finding Store By Distance and Location' , err);
      });
    }
  }

  private getStoreByRating(pageNumber, success) {
    this.queryResource.findStoreByRatingUsingGET(
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
    err => {
      this.logger.error('Error Finding Store By Distance' , err);
    });
  }

}
