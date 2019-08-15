import { IonSlides, IonRefresher, PopoverController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockCurrent, Entry } from 'src/app/api/models';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage implements OnInit {

  storeId;

  store;

  stockCurrents: StockCurrent[] = [];

  tempStockCurrents = [];

  currentSegment = 'menu';

  selectedCategory = 'All';

  showRestaurantLoading = true;

  showCategoryWiseProducts = true;

  categories = [];

  entry = [];

  @ViewChild(IonSlides, null) ionSlides: IonSlides;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;


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
          console.log('Got Store', result);
          this.store = result;
          this.showRestaurantLoading = false;
        },
        err => {
          this.showRestaurantLoading = false;
          console.log('Error fetching store data', err);
        }
      );
  }

  getCategoriesEntry(i) {
    this.queryResource
    .findCategoryAndCountUsingGET(this.storeId)
    .subscribe(result => {
      console.log('Got Categories' , result);
      this.entry = result;
    });
  }

  getCategories(i) {
    this.queryResource
    .findAllCategoriesUsingGET({
      iDPcode: this.storeId
    })
    .subscribe(result => {
      console.log('Got Categories' , result);
      result.content.forEach(c => {
        this.categories.push(c);
      });
      ++i;
      if (i < result.totalPages) {
        this.getCategories(i);
      } 
    });
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
          this.logger.info('Got StockCurrent of ' , this.selectedCategory , this.stockCurrents);
          this.showCategoryWiseProducts = false;
        }
      }
    });
    return await popover.present();
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
    this.getCategories(0);
  }

  toggleIonRefresher() {
    this.IonRefresher.complete();
  }
}
