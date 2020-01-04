import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { SharedDataService } from './shared-data.service';

export const filterKey = 'filter';

export enum FILTER_TYPES {

  NO_FILTER,
  CATEGORY_WISE,
  // This is the Default filter
  DISTANCE_WISE,
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


  private currentFilter: FILTER_TYPES;
  private filterBehaviour: BehaviorSubject<FILTER_TYPES> = new BehaviorSubject<FILTER_TYPES>(this.currentFilter);
  private selectedCusines: string[];
  private currentLatLon = [];
  private distance = 0;


  constructor(
    private queryResource: QueryResourceService,
    private logger: LogService,
    private shareData: SharedDataService
  ) {
    this.initFilter();
  }

  private initFilter() {
    this.logger.info(this,'Filter Service Created')
    this.getFilterDataFromStorage();
  }

  private getFilterDataFromStorage() {
    this.shareData.getData(filterKey)
      .then(data => {
        if (data) {
          switch (data.type) {
            case 'cusine':
              const tempArray = [];
              data.cusines.forEach(c => {
                tempArray.push(c.key);
              })
              this.setSelectedCusines(tempArray);
              this.setCurrentFilter(data.currentFilterType);
              break;
            case 'sort':
              this.setCurrentFilter(data.currentFilterType);
              break;
          }
        }
      })
  }

  public getFilterSubscription() {
    return this.filterBehaviour;
  }

  public setCurrentFilter(filter) {
    this.currentFilter = filter;
    this.filterBehaviour.next(filter);
  }

  public getCurrentFilter() {
    return this.currentFilter;
  }

  public setSelectedCusines(selectedCusines: any) {
    this.selectedCusines = selectedCusines;
  }

  public setLocationFilterData(currentLatLon: any, distance: number) {
    this.currentLatLon = currentLatLon;
    this.distance = distance;
  }

  public getStores(pageNumber, success, error?) {
    if (this.currentFilter == FILTER_TYPES.NO_FILTER.valueOf()) {
      this.logger.info(this, 'Finding All Stores');
      this.getStoreNoFilter(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.DELIVERY_TIME.valueOf()) {
      this.getStoreByDeliveryTime(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.MIN_AMOUNT.valueOf()) {
      this.getStoreByMinAmount(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.DISTANCE_WISE.valueOf()) {
      this.logger.info(this, 'Finding Store By Distance and Location', this.distance);
      this.getStoreByDistance(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.TOP_RATED.valueOf()) {
      this.logger.info(this, 'Finding Store By Rating');
      this.getStoreByRating(pageNumber, success, error);
    } else if (this.currentFilter == FILTER_TYPES.CUSINE_FILTER.valueOf()) {
      this.logger.info(this, 'Finding Store By Cusines');
      this.getStoreByCusines(pageNumber, success, error);
    }

  }

  private getStoreByMinAmount(pageNumber: any, success: any, error: any) {
    this.logger.info(this, 'Fetching Store by Min Amount');
    this.queryResource.findAndSortStoreByMinAmountUsingGET({
      page: pageNumber
    }).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this, 'Error Finding Store By Cusine Filter', err);
        error();
      });
  }

  private getStoreByCusines(pageNumber, success, error?) {
    this.logger.info(this, 'Fetching Stores Via Cusines', this.selectedCusines);
    this.queryResource.facetSearchByStoreTypeNameUsingPOST(
      {
        storeTypeWrapper: {
          typeName: this.selectedCusines
        },
        page: pageNumber
      }
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this, 'Error Finding Store By Cusine Filter', err);
        error();
      });
  }

  private getStoreByDistance(pageNumber, success, error?) {
    this.queryResource
      .findStoreByNearLocationUsingGET({
        page: pageNumber,
        lat: this.currentLatLon[0],
        lon: this.currentLatLon[1],
        distanceUnit: 'KILOMETERS',
        distance: this.distance
      })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      },
        err => {
          this.logger.error(this, 'Error Finding Store By Distance and Location', err);
          error();
        });
  }

  private getStoreByRating(pageNumber, success, error?) {
    this.logger.info(this, 'Getting STores Via Rating Filter');
    this.queryResource.findStoreByRatingUsingGET(
      {
        page: pageNumber
      }
    ).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this, 'Error Finding Store By Distance', err);
        error();
      });
  }

  private getStoreNoFilter(pageNumber, success, error?) {
    this.logger.info(this, 'Getting STores Via No Filter');
    this.queryResource.findAllStoresUsingGET({
      page: pageNumber
    }).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this, 'Error Finding Stores', err);
        error();
      });
  }

  private getStoreByDeliveryTime(pageNumber, success, error?) {
    this.logger.info(this, 'Getting Stores Via Delivery Time Filter');
    this.queryResource.findAndSortStoreByMinAmountUsingGET({
      page: pageNumber
    }).subscribe(data => {
      success(data.totalElements, data.totalPages, data.content);
    },
      err => {
        this.logger.error(this, 'Error Finding Stores', err);
        error();
      });
  }

}
