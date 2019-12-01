import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(
    private storage: Storage,
  ) { 
  }

  saveToStorage(key, service) {
    return this.storage.set(key, service);
  }

  getData(key) {
    return this.storage.get(key);
  }

  deleteData(key) {
    this.storage.remove(key);
  }

  clearAll() {
    this.storage.clear();
  }

  clearKeys(...keys) {
    keys.forEach(key=> {
      this.storage.remove(key);
    });
  }
}
