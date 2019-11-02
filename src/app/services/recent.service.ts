import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

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

  recents:any[] = [];

  private observableRecents: BehaviorSubject<any> = new BehaviorSubject<any>(this.recents);

  private observableRecentLocations:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private observableRecentRestaurants:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private obeservableRecentProducts: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private storage: Storage) { 
    console.log('RecentService');
    this.getRecentsFromStorage();
  }

  ngOnInit() {
  }

  private getRecentsFromStorage() {
    this.storage.get(recentKey)
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
    this.storage.set(recentKey, this.recents)
    .then(()=> {
      this.getRecentsFromStorage();
    });
  }

}
