import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';

export enum FILTER_TYPES {

  NO_FILTER,

  CATEGORY_WISE,
  DISTANCE_WISE, // This is the Default filter
  DELIVERY_TYPE,

  // Sort Types
  TOP_RATED,
  DELIVERY_TIME,
  MIN_AMOUNT,
  CUSINE_FILTER
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {


  // Change to FILTER_TYPES.DISTANCE_WISE
  private currentFilter = FILTER_TYPES.DISTANCE_WISE;
  private filterBehaviour = new BehaviorSubject<any>(this.currentFilter);


  // For Location Based Search
  currentCordinates: any;
  distance = 25;
  private locationBehaviour = new BehaviorSubject<any>(this.currentCordinates);
  selectedCusines: string[];


  constructor(
    private queryResource: QueryResourceService,
    private logger: LogService
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

  setSelectedCusines(selectedCusines: any) {
    this.selectedCusines = selectedCusines;
  }

  public getStores(pageNumber, success, error?) {
    console.log(this.currentFilter == FILTER_TYPES.TOP_RATED.valueOf());
    if (this.currentFilter == FILTER_TYPES.NO_FILTER.valueOf()) {
      this.logger.info(this,'Finding All Stores');
      this.getStoreNoFilter(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.DELIVERY_TIME.valueOf()) {
      this.getStoreByDeliveryTime(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.MIN_AMOUNT.valueOf()) {
      this.getStoreByMinAmount(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.DISTANCE_WISE.valueOf()) {
      this.logger.info(this,'Finding Store By Distance and Location', this.distance);
      this.getStoreByDistance(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.TOP_RATED.valueOf()) {
      this.logger.info(this,'Finding Store By Rating');
      this.getStoreByRating(pageNumber, success, error);
    }
    else if (this.currentFilter == FILTER_TYPES.CUSINE_FILTER.valueOf()) {
      this.logger.info(this,'Finding Store By Cusines');
      this.getStoreByCusines(pageNumber, success, error);
    }

  }

  getStoreByMinAmount(pageNumber: any, success: any, error: any) {
    this.logger.info(this,'Fetching Store by Min Amount');
    this.queryResource.findAndSortStoreByMinAmountUsingGET({
      page:pageNumber
    }).subscribe(data => {
      success(data.totalElements,data.totalPages,data.content);
    },
    err=> {
      this.logger.error(this,'Error Finding Store By Cusine Filter' , err);
      error();
    })
  }

  private getStoreByCusines(pageNumber, success, error?) {
    this.logger.info(this,'Fetching Stores Via Cusines' , this.selectedCusines);
    this.queryResource.facetSearchByStoreTypeNameUsingPOST(
      {
        storeTypeWrapper: {
          typeName: this.selectedCusines
        },
        page: pageNumber
      }
    )
    .subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
    err => {
      this.logger.error(this,'Error Finding Store By Cusine Filter' , err);
      error();
    });
  }

  private getStoreByDistance(pageNumber, success, error?) {
    this.logger.info(this,'Getting Stores Via Distance Filter' , this.currentCordinates);
    if (this.currentCordinates !== undefined) {
      this.locationBehaviour.next(this.currentCordinates);
      this.queryResource
      .findStoreByNearLocationUsingGET({
        lat: this.currentCordinates.coords ? this.currentCordinates.coords.latitude : this.currentCordinates[0],
        lon: this.currentCordinates.coords ? this.currentCordinates.coords.longitude : this.currentCordinates[1],
        distanceUnit: 'KILOMETERS',
        distance: this.distance
      })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
      err => {
        this.logger.error(this,'Error Finding Store By Distance and Location' , err);
        error();
      });
    }
  }

  private getStoreByRating(pageNumber, success, error?) {
    this.logger.info(this,'Getting STores Via Rating Filter');
    this.queryResource.findStoreByRatingUsingGET(
      {}
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this,'Error Finding Store By Distance', err);
        error();
      });
  }

  private getStoreNoFilter(pageNumber, success, error?) {
    this.logger.info(this,'Getting STores Via No Filter');
    this.queryResource.findAllStoresUsingGET({
      page: pageNumber
    })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
        err => {
          this.logger.error(this,'Error Finding Stores', err);
          error();
        });
  }

  private getStoreByDeliveryTime(pageNumber, success, error?) {
    this.logger.info(this,'Getting Stores Via Delivery Time Filter');
    this.queryResource.findAndSortStoreByMinAmountUsingGET({
      page: pageNumber
    })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
        err => {
          this.logger.error(this,'Error Finding Stores', err);
          error();
        });
  }
}
