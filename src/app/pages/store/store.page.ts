import { IonSlides, IonRefresher, PopoverController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockCurrent, Entry } from 'src/app/api/models';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage implements OnInit {

  storeId;

  store;

  stockCurrents: StockCurrent[] = [];

  categoryStockCurrents = {}

  tempStockCurrents = [];

  currentSegment = 'menu';

  selectedCategory = 'All';

  showLoading = true;
  showRestaurantLoading = true;

  @ViewChild(IonSlides, null) ionSlides: IonSlides;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  categories: Entry[] = [];

  constructor(
    private queryResource: QueryResourceService,
    private route: ActivatedRoute,
    private popover: PopoverController,
    private util: Util
  ) {}

  ngOnInit() {
    this.getStoreId();
    this.getStore();
    this.getProducts(0, false);
    this.getCategories(0);
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

  getProducts(i, limit) {
    this.queryResource
      .findStockCurrentByStoreIdUsingGET(this.storeId)
      .subscribe(
        result => {
          if (result != null) {
            result.content.forEach(s => {
              this.stockCurrents.push(s);
            });
            this.showLoading = false;
            i++;
            if (limit === false) {
              if (i < result.totalPages) {
                this.getProducts(i, limit);
              }
            }
          }
        },
        err => {
          console.log('Error fetching product data', err);
          this.showLoading = false;
        }
      );
  }

  getCategories(i) {
    this.queryResource
    .findCategoryAndCountUsingGET(this.storeId)
    .subscribe(result => {
      console.log('Got Categories' , result);
      this.categories = result;
      this.categories.forEach(c => {
        this.categoryStockCurrents[c.key] = [];
      });
      this.categories.forEach(c => {
        this.getProductsCategoryWise(0 , c.key);
      });
    });
  }

  getProductsCategoryWise(i , cname) {
    this.categories.forEach(c => {
      this.queryResource.findProductByStoreIdAndCategoryNameUsingGET({
        userId: this.storeId,
        categoryName: cname
      })
      .subscribe(p => {

        p.content.forEach(s => {
          this.categoryStockCurrents[cname].push(s);
        });
        ++i;
        if (i < p.totalPages) {
          this.getProductsCategoryWise(i , cname);
        } else {
          console.log(cname , this.categoryStockCurrents[cname]);
        }
      });
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
        categories: this.categories,
        storeId: this.storeId,
        selectedCategory: this.selectedCategory
      },
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then((data: any) => {
      console.log(data.data.result);
      if (data.data !== undefined) {
        this.selectedCategory = data.data.selectedCategory;
        if (this.selectedCategory === 'All') {
          this.stockCurrents = this.tempStockCurrents;
        } else {
          console.log('Got products');
          this.stockCurrents = data.data.result.filter(s => s !== null);
        }
      } else {
        this.util.createToast('Error while Getting data');
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
    this.getProducts(0, false);
  }

  toggleIonRefresher() {
    this.IonRefresher.complete();
  }
}
