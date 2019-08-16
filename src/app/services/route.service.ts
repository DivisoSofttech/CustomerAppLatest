import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private currentRoute = 'restaurant';
  private routeSubscription = new BehaviorSubject<any>(this.currentRoute);

  constructor(
    private route: Router,
    private logger: NGXLogger
  ) { 
    this.getCurrentRoute();
  }

  getCurrentRoute() {
   this.route.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) 
      {
        this.currentRoute = this.route.url.split('/')[1];
        this.routeSubscription.next(this.currentRoute);
        this.logger.info('Route Changed ' , this.currentRoute);
      }
    });
  }
  getRouteSubscription() {
    return this.routeSubscription;
  }
}
