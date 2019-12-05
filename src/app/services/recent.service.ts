import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { SharedDataService } from './shared-data.service';
import { Store } from '../api/models';

const recentKey = 'recent';

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
export class RecentService implements OnInit{

  currentStoreBehaviour = new BehaviorSubject<Store>(null);

  setCurrentStore(store) {
    this.currentStoreBehaviour.next(store);
  }

  getCurrentStore() {
    return this.currentStoreBehaviour;
  }

  recents:any[] = [];

  private observableRecents: BehaviorSubject<any> = new BehaviorSubject<any>(this.recents);

  private observableRecentLocations:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private observableRecentRestaurants:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private obeservableRecentProducts: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private sharedData: SharedDataService,
    private logger: NGXLogger) 
  { 
    this.logger.info("Created Recent Service");
    this.getRecentsFromStorage();
  }

  ngOnInit() {
  }

  private getRecentsFromStorage() {
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

  getRecents() {
    return this.observableRecents;
  }

  getRecentLocations() {
    return this.observableRecentLocations;
  }

  getRecentRestaurantSearchTerms() {
    return this.observableRecentRestaurants;
  }

  getRecentProductSearchTerms() {
    return this.obeservableRecentProducts;
  }

  saveRecent(data: any) {
    this.recents.push(data);
    this.sharedData.saveToStorage(recentKey, this.recents)
    .then(()=> {
      this.getRecentsFromStorage();
    });
  }

}
