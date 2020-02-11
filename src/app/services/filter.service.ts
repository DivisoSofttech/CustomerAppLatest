import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { SharedDataService } from './shared-data.service';
import { ResultBucket } from '../api/models';

export const FILTER_KEY = 'filter';

export interface ResultBucketModel extends ResultBucket {
  checked: boolean;
}

export interface FilterModel {
  type?: string;
  cusines?: ResultBucketModel[];
  currentFilterType?: FILTER_TYPES;
}

export enum FILTER_TYPES {

  NO_FILTER,
  CATEGORY_WISE,
  // This is the Default filter
  DISTANCE_WISE,

  // Sort Types
  TOP_RATED,
  MODE_OF_DELIVERY_DELIVERY,
  MODE_OF_DELIVERY_PICKUP,
  DELIVERY_TIME,
  MIN_AMOUNT,
  CUSINE_FILTER
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {


  private filterModel: FilterModel = {
    currentFilterType: FILTER_TYPES.DISTANCE_WISE,
    cusines: []
  };
  private filterBehaviourNew: BehaviorSubject<FilterModel> = new BehaviorSubject<FilterModel>(this.filterModel);
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
    this.logger.info(this, 'Filter Service Created')
    this.getFilterDataFromStorage();
  }

  private getFilterDataFromStorage() {
    this.shareData.getData(FILTER_KEY)
      .then(data => {
        if (data) {
          this.filterModel = data;
          if (data.currentFilterType !== FILTER_TYPES.DISTANCE_WISE) {
            this.filterBehaviourNew.next(this.filterModel);
          }
        }
      })
  }

  public getFilterSubscription() {
    return this.filterBehaviourNew;
  }

  public setCurrentFilter(filter) {
    this.filterModel.currentFilterType = filter;
    this.filterBehaviourNew.next(this.filterModel);
  }

  public getCurrentFilter() {
    return this.filterModel.currentFilterType;
  }

  public setSelectedCusines(selectedCusines: ResultBucketModel[]) {
    this.filterModel.cusines = selectedCusines;
  }


  public activateDistanceFilter(latLon: number[], maxDistance: any) {
    this.currentLatLon = latLon;
    this.distance = maxDistance;
    this.filterModel.currentFilterType = FILTER_TYPES.DISTANCE_WISE;
    this.filterBehaviourNew.next(this.filterModel);
  }


  public getStores(pageNumber, success, error?) {
    if (this.filterModel.currentFilterType == FILTER_TYPES.NO_FILTER.valueOf()) {
      this.logger.info(this, 'Finding All Stores');
      this.getStoreNoFilter(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.DELIVERY_TIME.valueOf()) {
      this.getStoreByDeliveryTime(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.MIN_AMOUNT.valueOf()) {
      this.getStoreByMinAmount(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.DISTANCE_WISE.valueOf()) {
      this.logger.info(this, 'Finding Store By Distance and Location', this.distance);
      this.getStoreByDistance(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.TOP_RATED.valueOf()) {
      this.logger.info(this, 'Finding Store By Rating');
      this.getStoreByRating(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.CUSINE_FILTER.valueOf()) {
      this.logger.info(this, 'Finding Store By Cusines');
      this.getStoreByCusines(pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.MODE_OF_DELIVERY_DELIVERY.valueOf()){
      this.getStoresByModeOfDelivery('delivery', pageNumber, success, error);
    } else if (this.filterModel.currentFilterType == FILTER_TYPES.MODE_OF_DELIVERY_PICKUP.valueOf()){
      this.getStoresByModeOfDelivery('collection', pageNumber, success, error);
    }

  }

  private getStoresByModeOfDelivery(modeOfDelivery: any, pageNumber: any, success: any, error: any) {
    this.logger.info(this, 'Fetching stores by mode of delivery', modeOfDelivery);
    this.queryResource.findStoreByDeliveryTypeUsingGET({deliveryType: modeOfDelivery,page: pageNumber })
      .subscribe(data => {
        success(data.totalElements, data.totalPages, data.content);
      }, err => {
        this.logger.info('Something went wrong when fetching stores by mode of delivery filter ', modeOfDelivery);
        error();
      });
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
    this.logger.info(this, 'Fetching Stores Via Cusines', this.filterModel.cusines);
    const tempArray = [];
    this.filterModel.cusines.forEach(c => {
      tempArray.push(c.key);
    })
    this.queryResource.facetSearchByStoreTypeNameUsingPOST(
      {
        storeTypeWrapper: {
          typeName: tempArray
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
    if (this.currentLatLon.length === 2) {
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
    } else {
      this.logger.warn(this, 'No LatLon Provided');
    }
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
