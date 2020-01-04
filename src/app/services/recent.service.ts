import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedDataService } from './shared-data.service';
import { Store } from '../api/models';
import { LogService } from './log.service';

export const recentKey = 'recent';

export enum RecentType {
  STORE , LOCATION , PRODUCT  
}

export class Recent {
  data: any;
  type: RecentType;
}

@Injectable({
  providedIn: 'root'
})
export class RecentService {

  recents:any[] = [];

  private currentSelectedStoreBehaviour = new BehaviorSubject<Store>(null);

  private observableRecents: BehaviorSubject<Recent[]> = new BehaviorSubject<any>(this.recents);

  private observableRecentLocations:BehaviorSubject<Recent[]> = new BehaviorSubject<any>(null);

  private observableRecentRestaurants:BehaviorSubject<Recent[]> = new BehaviorSubject<any>(null);

  private obeservableRecentProducts: BehaviorSubject<Recent[]> = new BehaviorSubject<any>(null);

  constructor(
    private sharedData: SharedDataService,
    private logger: LogService
  ) { 
    this.initRecent();
  }


  private initRecent() {
    this.logger.info(this, "Created Recent Service");
    this.getRecentDataFromStorage();
  }


  private getRecentDataFromStorage() {
    this.sharedData.getData(recentKey)
    .then(recents => {
      if(recents !== null && recents !== undefined) {
        console.log('Recents' , recents);
        this.recents = recents;
        this.observableRecentLocations.next(this.recents.filter(recent => recent.type===RecentType.LOCATION));
        this.observableRecentRestaurants.next(this.recents.filter(recent => recent.type===RecentType.STORE));
        this.obeservableRecentProducts.next(this.recents.filter(recent => recent.type===RecentType.PRODUCT));
        this.observableRecents.next(this.recents);
      }
    });
  }

  public setCurrentSelectedStore(store: Store) {
    this.currentSelectedStoreBehaviour.next(store);
  }

  public getCurrentSelectedStore() {
    return this.currentSelectedStoreBehaviour;
  }
  
  public getRecentSearchTerms() {
    return this.observableRecents;
  }

  public getRecentLocationsSearchTerms() {
    return this.observableRecentLocations;
  }

  public getRecentRestaurantSearchTerms() {
    return this.observableRecentRestaurants;
  }

  public getRecentProductSearchTerms() {
    return this.obeservableRecentProducts;
  }

  public saveRecent(data: any) {
    this.recents.push(data);
    this.sharedData.saveToStorage(recentKey, this.recents)
    .then(()=> {
      this.getRecentDataFromStorage();
    });
  }

}
