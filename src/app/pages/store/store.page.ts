import { IonSlides, IonRefresher, PopoverController, NavController, Platform} from '@ionic/angular';
import { ViewChild, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockCurrent,  Category, Store } from 'src/app/api/models';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { ClosedPipe } from 'src/app/pipes/closed.pipe';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage implements OnInit , OnDestroy {


  slideOptions = {autoHeight: true};

  storeId;

  store: Store;

  stockCurrents: StockCurrent[] = [];

  tempStockCurrents: StockCurrent[] = [];

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
  slidesMoving: boolean;
  slidesHeight: number;
  timeNow: Date;
  slideWidthChecker;
  isOrderAvailable: any = true;
  isClosed = false;
  categoryLoading: boolean = true;

  constructor(
    private queryResource: QueryResourceService,
    private route: ActivatedRoute,
    private popover: PopoverController,
    private logger: LogService,
    private platform: Platform,
    private navController: NavController,
    private closedPipe: ClosedPipe
  ) {}

  ngOnInit() {
    this.getStoreId();
    this.getStore();
    this.getCategories(0);
    this.getCategoriesEntry(0);
    this.timeNow = new Date();

    // temp Fix for sliderHeight
    this.slideWidthChecker =  setInterval(() => {
      if (this.ionSlides !== undefined) {
        this.ionSlides.updateAutoHeight();
      }
    }, 5000);

  }

  ngOnDestroy(): void {
   clearInterval(this.slideWidthChecker);
  }

  getStoreId() {
    this.storeId = this.route.snapshot.paramMap.get('id');
  }

  getStore() {
    this.queryResource
      .findStoreByRegisterNumberUsingGET(this.storeId)
      .subscribe(
        result => {
          this.logger.info(this,'Got Store ', result.name, result);
          this.store = result;
          this.showRestaurantLoading = false;
          this.checkPreorderStatus();
          this.checkClosedStatus();
          // Show the Store In Map
          if (this.map !== undefined) {
            this.map.loadMap(this.store.location);
          }
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
          this.logger.info(this,'Got Categories Entry', result);
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
        this.logger.info(this,this,'Got Categories', result);
        result.content.forEach(c => {
          this.categories.push(c);
        });
        ++i;
        if (i < result.totalPages) {
          // this.getCategories(i);
          this.categoryLoading=false; 
        } else {
          this.categoryLoading = false;
        }
        this.toggleIonRefresher();
      });
  }

  async categoryListPopOver(ev: any) {
    this.tempStockCurrents = this.stockCurrents;
    this.platform.width() >= 1280 ? null : ev = null;
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
      this.swapCategoryOnDismiss(data);
    });
    return await popover.present();
  }

  swapCategoryOnDismiss(data) {
    if (data.data !== undefined) {
      this.selectedCategory = data.data.selectedCategory;
      if (this.selectedCategory === 'All') {
        this.stockCurrents = this.tempStockCurrents;
        this.showCategoryWiseProducts = true;
      } else {
        this.stockCurrents = data.data.result.filter(s => s !== null);
        this.logger.info(this,
          'Got StockCurrent of ',
          this.selectedCategory,
          this.stockCurrents
        );
        this.ionSlides.updateAutoHeight();
        this.showCategoryWiseProducts = false;
      }
    }
  }

  navigateBasket() {
    this.logger.info(this,'Routing to basket');
    this.navController.navigateForward('/basket');
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
      this.ionSlides.updateAutoHeight();
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
    this.ngOnInit();
  }

  toggleIonRefresher() {
    this.IonRefresher.complete();
  }

  toggleFabButton(val) {
    this.logger.info(this,val, '----');
    this.logger.info(this,'Hiding Fab Button');
    this.showCatgeoryFilterFab = val;
  }


  checkPreorderStatus() {

    //Restaurant Should Be Closed
    // Preorder Should be Avialable
    // And Current Time should be between preorder[fromTime and toTime]
    const currentTime = new Date();
    this.isOrderAvailable = !this.closedPipe.transform(currentTime,this.store.openingTime,this.store.closingTime)
    && this.store.preOrderSettings.isPreOrderAvailable
    && this.closedPipe.transform(currentTime, this.store.preOrderSettings.fromTime,this.store.preOrderSettings.toTime);
  }

  checkClosedStatus() {
    const currentTime = new Date();
    this.isClosed = !this.closedPipe.transform(currentTime,this.store.openingTime,this.store.closingTime)
  }
}
