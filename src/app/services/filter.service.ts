import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private currentFilter = FILTER_TYPES.TOP_RATED;
  private filterBehaviour = new BehaviorSubject<any>(this.currentFilter);

  // For Location Based Search
  currentCordinates: any;
  distance = 25;

  constructor(private queryResource: QueryResourceService) {}

  public getSubscription() {
    return this.filterBehaviour;
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
        console.log('Getting Store By Distance ', this.distance);
        this.getStoreByDistance(pageNumber, success);
        break;
      case FILTER_TYPES.TOP_RATED:
        console.log('Getting Store By Rating ');
        this.getStoreByRating(pageNumber, success);
        break;
    }
  }

  private getStoreByDistance(pageNumber, success) {
    this.queryResource
      .searchByNearestLocationUsingGET({
        latLon: this.currentCordinates,
        kiloMeter: this.distance,
        page: pageNumber
      })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      });
  }

  private getStoreByRating(pageNumber, success) {
    this.queryResource.findStoreByRatingUsingGET(
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    });
  }

}
