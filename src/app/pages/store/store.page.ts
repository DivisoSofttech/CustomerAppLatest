import { IonSlides, IonRefresher, PopoverController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockCurrent, Entry, Category, Store } from 'src/app/api/models';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';
import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage implements OnInit {
  storeId;

  store: Store;

  stockCurrents: StockCurrent[] = [];

  tempStockCurrents = [];

  currentSegment = 'menu';

  selectedCategory = 'All';

  showRestaurantLoading = true;

  showCategoryWiseProducts = true;

  categories: Category[] = [];

  entry = [];

  showCatgeoryFilterFab = true;

  @ViewChild(IonSlides, null) ionSlides: IonSlides;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  @ViewChild(MapComponent, null) map: MapComponent;

  constructor(
    private queryResource: QueryResourceService,
    private route: ActivatedRoute,
    private popover: PopoverController,
    private logger: NGXLogger,
    private util: Util
  ) {}

  ngOnInit() {
    this.getStoreId();
    this.getStore();
    this.getCategories(0);
    this.getCategoriesEntry(0);
  }

  getStoreId() {
    this.storeId = this.route.snapshot.paramMap.get('id');
  }

  getStore() {
    this.queryResource
      .findStoreByRegisterNumberUsingGET(this.storeId)
      .subscribe(
        result => {
          this.logger.info('Got Store ', result.name, result);
          this.store = result;
          this.showRestaurantLoading = false;

          // Show the Store In Map
          this.map.loadMap(this.store.location);
        },
        err => {
          this.showRestaurantLoading = false;
          this.logger.fatal('Error Fetching Stores', err);
        }
      );
  }

  getCategoriesEntry(i) {
    this.queryResource
      .findCategoryAndCountBystoreIdUsingGET({
        storeId: this.storeId
      })
      .subscribe(
        result => {
          this.logger.info('Got Categories Entry', result);
          this.entry = result;
        },
        err => {
          this.logger.fatal('Error Fetching Categories Entry', err);
        }
      );
  }

  getCategories(i) {
    this.queryResource
      .findAllCategoriesUsingGET({
        iDPcode: this.storeId
      })
      .subscribe(result => {
        this.logger.info('Got Categories', result);
        result.content.forEach(c => {
          this.categories.push(c);
        });
        ++i;
        if (i < result.totalPages) {
          this.getCategories(i);
        }
        this.toggleIonRefresher();
      });
  }

  async categoryListPopOver(ev: any) {
    this.tempStockCurrents = this.stockCurrents;
    const popover = await this.popover.create({
      component: HotelMenuPopoverComponent,
      componentProps: {
        categories: this.entry,
        storeId: this.storeId,
        selectedCategory: this.selectedCategory
      },
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then((data: any) => {
      if (data.data !== undefined) {
        this.selectedCategory = data.data.selectedCategory;
        if (this.selectedCategory === 'All') {
          this.stockCurrents = this.tempStockCurrents;
          this.showCategoryWiseProducts = true;
        } else {
          this.stockCurrents = data.data.result.filter(s => s !== null);
          this.logger.info(
            'Got StockCurrent of ',
            this.selectedCategory,
            this.stockCurrents
          );
          this.showCategoryWiseProducts = false;
        }
      }
    });
    return await popover.present();
  }

  segmentChanged(event) {
    this.currentSegment = event.detail.value;
    if (this.currentSegment === 'menu') {
      this.ionSlides.slideTo(0);
    } else if (this.currentSegment === 'reviews') {
      this.ionSlides.slideTo(1);
    } else {
      this.ionSlides.slideTo(2);
    }
  }

  slideChanged(event) {
    let index: any;
    this.ionSlides.getActiveIndex().then(num => {
      index = num;
      if (index === 0) {
        this.currentSegment = 'menu';
      } else if (index === 1) {
        this.currentSegment = 'reviews';
      } else {
        this.currentSegment = 'info';
      }
    });
  }

  refresh(event) {
    this.stockCurrents = [];
    this.tempStockCurrents = [];
    this.categories = [];
    this.getCategories(0);
  }

  toggleIonRefresher() {
    this.IonRefresher.complete();
  }

  toggleFabButton() {
    this.logger.info('Hiding Fab Button');
    this.showCatgeoryFilterFab = !this.showCatgeoryFilterFab;
  }
}
