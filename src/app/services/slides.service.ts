import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SharedDataService } from './shared-data.service';
import { LogService } from './log.service';
import { NavController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SlidesService implements CanActivate {

  isFirstTime: boolean;

  constructor(
    private sharedData: SharedDataService,
    private logger: LogService,
    private navController: NavController,
    private platform: Platform
  ) { }

  /**
   * This function is called When the app route changes
   * @param route 
   * @param state 
   * 
   */
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      if(this.platform.is('pwa' || 'mobileweb')) {
        resolve(true);
      } else {
        this.sharedData.getData('isFirstTime')
        .then(data => {
          if(data === true || data === undefined || data === null) {
            this.logger.info(this,'App is starting for first time',data);
            this.isFirstTime = true;
            reject(true);
            this.navController.navigateForward('/slides');
          } else {
            this.isFirstTime = false;
            resolve(true)        
          }
        });          
      }
  });
  }
}
