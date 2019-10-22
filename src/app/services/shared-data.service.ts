import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationStart } from '@angular/router';
import { CartService } from './cart.service';

export let browserRefresh;

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(
    private storage: Storage,
  ) { 
  }

  saveToStorage(key,service) {
    this.storage.set(key, service);
  }

  getData(key) {
    return this.storage.get(key);
  }

  deleteData(key) {
    this.storage.remove(key);
  }
}
