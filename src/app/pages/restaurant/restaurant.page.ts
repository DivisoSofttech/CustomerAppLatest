import { StoreDTO } from './../../api/models/store-dto';
import { FilterService } from './../../services/filter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Util } from 'src/app/services/util';
import { IonInfiniteScroll, IonRefresher, ModalController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { MapComponent } from 'src/app/components/map/map.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { MakePaymentComponent } from 'src/app/components/make-payment/make-payment.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss']
})
export class RestaurantPage implements OnInit {

  showLoading = true;

  showFilters = false;

  page = 0;

  

  stores: StoreDTO[] = [];

  @ViewChild(IonInfiniteScroll , null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher , null) IonRefresher: IonRefresher;
  @ViewChild(MapComponent , null) mapComponent: MapComponent;
  @ViewChild(FooterComponent , null) footer: FooterComponent;



  constructor(
    private filter: FilterService,
    private util: Util,
    private logger: NGXLogger,
    private modalController: ModalController
  ) {}

  async presentmakePayment() {
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }
  ngOnInit() {
    this.getStores();
  }

  updatedLocation(event) {
    this.logger.info('Changed Current Location - LatLon ' , event);
    this.filter.setCoordinates(event.latLon);
    // this.logger.info('Setting Distance_wise Filter');
    // this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    // this.logger.info('Getting Stores');
  }

  getStores() {
    this.filter.getSubscription().subscribe(data => {
      this.stores = [];
      this.showLoading = true;
      this.toggleInfiniteScroll();
      this.filter.getStores(0, (totalElements, totalPages, stores) => {

        this.logger.info('Got Stores ' , stores);
        if (totalPages > 1) {
          this.logger.info('Enabling Infinite Scroll');
          this.toggleInfiniteScroll();
        }
        this.stores = [];
        stores.forEach(s => {
          this.stores.push(s);
        });

        // show stores in map
        this.mapComponent.setStoreLocationMarkers(stores);
        this.showLoading = false;
        this.toggleIonRefresher();
      });
    });
  }

  loadMoreStores(event) {
    this.logger.info('Load More Stores if exists');
    ++this.page;
    this.filter.getStores(this.page, (totalElements, totalPages, stores) => {
      event.target.complete();
      this.logger.info('Got Stores ' , stores);
      if (this.page === totalPages) {
        this.toggleInfiniteScroll();
      }
      if (totalPages === 1) {
        this.toggleInfiniteScroll();
      } else {
        stores.forEach(s => {
          this.stores.push(s);
        });
      }
    });
  }

  doRefresh(event) {
    this.logger.info('Refreshing Page');
    this.getStores();
  }

  toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }

  toggleIonRefresher() {
    this.logger.info('Disableing Ion Refresher');
    this.IonRefresher.complete();
  }

  toggleFilteromponent(event) {
    this.showFilters = !this.showFilters;
    if (event === 'close') {
      this.footer.setcurrentRoute('restaurant');
    }
  }

  // Fix for Footer
  ionViewDidEnter() {
    this.footer.setcurrentRoute('restaurant');
  }

}
