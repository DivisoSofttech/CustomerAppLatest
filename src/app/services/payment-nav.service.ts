import { Injectable } from '@angular/core';
import { IonNav } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PaymentNavService {

  nav: IonNav;

  constructor() { }

  setIonNav(nav) {
    this.nav = nav;
  }

  navigateTo(component) {
    this.nav.push(component);
  }

  pop() {
    this.nav.pop();
  }

  dismissModal() {

  }
}
