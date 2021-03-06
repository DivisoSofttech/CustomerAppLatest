import { IonSlides, IonRefresher, PopoverController, NavController, Platform, IonInfiniteScroll } from '@ionic/angular';
import { ViewChild, OnDestroy, HostListener } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockCurrent, Category, Store } from 'src/app/api/models';
import { HotelMenuPopoverComponent } from 'src/app/components/hotel-menu-popover/hotel-menu-popover.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { ClosedPipe } from 'src/app/pipes/closed.pipe';
import { LogService } from 'src/app/services/log.service';
import { RecentService } from 'src/app/services/recent.service';
import { KeycloakService } from 'src/app/services/security/keycloak.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
})
export class StorePage implements OnInit, OnDestroy {


  slideOptions = { autoHeight: true };

  storeId;

  store: Store;

  stockCurrents: StockCurrent[] = [];

  tempStockCurrents: StockCurrent[] = [];

  currentSegment = 'menu';

  selectedCategory = 'All';

  showRestaurantLoading = true;

  showCategoryWiseProducts = true;

  emptyStore = false;

  categories: Category[] = [];

  entry = [];

  showCatgeoryFilterFab = true;

  @ViewChild(IonSlides, null) ionSlides: IonSlides;
  @ViewChild(IonRefresher, null) IonRefresher: IonRefresher;
  @ViewChild(MapComponent, null) map: MapComponent;
  @ViewChild(IonInfiniteScroll, null) ionInfiniteScroll: IonInfiniteScroll;

  slidesMoving: boolean;
  slidesHeight: number;
  timeNow: Date;
  slideWidthChecker;
  isOrderAvailable: any = true;
  isClosed = false;
  isGuest = false;
  categoryLoading: boolean = true;
  keycloakSubscription: any;
  pageNum: any = 0;
  categoryShow = {};
  showFooter: any = true;
  showReview: any = true;
  highlightCategoryId;
  highlightProductId;

  constructor(
    private queryResource: QueryResourceService,
    private route: ActivatedRoute,
    private popover: PopoverController,
    private logger: LogService,
    private platform: Platform,
    private navController: NavController,
    private closedPipe: ClosedPipe,
    private recentService: RecentService,
    private keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.checkIfGuest();
    this.recentService.setCurrentSelectedStore(null);
    this.getStoreId();
    this.timeNow = new Date();
    this.checkPlatformWidth();
    // temp Fix for sliderHeight
    this.fixSliderHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkPlatformWidth();
  }


  checkPlatformWidth() {
    if (this.platform.width() >= 1280) {
      this.showReview = false;
    } else {
      this.showReview = true;
    }
  }

  checkIfGuest() {
    this.keycloakSubscription = this.keycloakService.getUserGuestSubscription()
      .subscribe(data => {
        if (data !== null) {
          this.isGuest = data;
        } else {
          this.isGuest = true;
        }
      });
  }

  fixSliderHeight() {
    this.slideWidthChecker = setInterval(() => {
      if (this.ionSlides !== undefined) {
        this.ionSlides.updateAutoHeight();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.slideWidthChecker);
  }

  getStoreId() {
    this.storeId = this.route.snapshot.paramMap.get('id');
    if (!this.storeId) {
      const idpcode = this.route.snapshot.paramMap.get('idpcode');
      this.filterSearchedItem();
      this.getStoreByIdpCode(idpcode)
    } else {
      this.getStore();
    }
  }

  filterSearchedItem() {
    const type = this.route.snapshot.paramMap.get('type');
    this.highlightProductId = this.route.snapshot.paramMap.get('tid');
    this.highlightCategoryId  = this.route.snapshot.paramMap.get('cid');
  }

  getStoreDetails() {
    this.recentService.setCurrentSelectedStore(this.store);
    this.showRestaurantLoading = false;
    this.checkPreorderStatus();
    this.checkClosedStatus();
    this.getCategories(0);
    this.getCategoriesEntry(0);
    // Show the Store In Map
    if (this.map !== undefined) {
      this.map.loadMap(this.store.location);
    }
  }

  getStoreByIdpCode(idpcode) {
    this.queryResource.findStoreByRegisterNumberUsingGET(idpcode)
      .subscribe(result => {
        this.logger.info(this, 'Got Store ', result.name, result);
        this.store = result;
        this.getStoreDetails();
      },
        err => {
          this.showRestaurantLoading = false;
          this.logger.fatal('Error Fetching Stores', err);
        })
  }

  getStore() {
    this.queryResource
      .findStoreByIdUsingGET(this.storeId)
      .subscribe(
        result => {
          this.logger.info(this, 'Got Store ', result.name, result);
          this.store = result;
          this.getStoreDetails();
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
        storeId: this.store.regNo
      })
      .subscribe(
        result => {
          this.logger.info(this, 'Got Categories Entry', result);
          this.entry = result;
        },
        err => {
          this.logger.fatal('Error Fetching Categories Entry', err);
        }
      );
  }

  toggleCategoryShow(id) {
    this.categoryShow[id] = !this.categoryShow[id];
    this.ionSlides.updateAutoHeight()
      .then(() => {
        document.body.scrollTo(0, 0);
      });
  }

  getCategories(i, event?) {
    this.queryResource
      .findAllCategoriesUsingGET({
        iDPcode: this.store.regNo,
        page: i
      })
      .subscribe(result => {
        this.logger.info(this, this, 'Got Categories', result);
        let j = 0;
        if (i === 0 && result.content.length === 0) {
          this.emptyStore = true;
        }
        result.content.forEach(c => {
          if(c.id == this.highlightCategoryId) {
            this.categories.unshift(c);
            this.categoryShow[c.id] = true;
          } else {
            this.categories.push(c);
          }
          if (i < 1 && j < 2 && this.platform.width() < 1280) {
            this.categoryShow[c.id] = true;
            j++;
          } else if (i < 1 && j < 4 && this.platform.width() >= 1280) {
            this.categoryShow[c.id] = true;
            j++;
          } else {
            if(c.id != this.highlightCategoryId) {
              this.categoryShow[c.id] = false;
            }
          }
        });
        if (i > 0 && event) {
          event.target.complete()
        }
        if (i === result.totalPages) {
          this.toggleInfiniteScroll();
        }
        this.toggleIonRefresher();
        this.categoryLoading = false;
      });
  }

  loadMoreCategories(event) {
    ++this.pageNum;
    this.logger.info(this, 'Fetching More Categories', this.pageNum);
    this.getCategories(this.pageNum, event);
  }

  toggleInfiniteScroll() {
    this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
  }


  async categoryListPopOver(ev: any) {
    this.tempStockCurrents = this.stockCurrents;
    this.platform.width() >= 1280 ? null : ev = null;
    const popover = await this.popover.create({
      component: HotelMenuPopoverComponent,
      componentProps: {
        categories: this.entry,
        storeId: this.store.regNo,
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
    this.logger.info(this, 'Routing to basket');
    this.navController.navigateForward('/basket');
  }

  segmentChanged(event) {
    this.currentSegment = event.detail.value;
    if (this.currentSegment === 'menu') {
      this.ionSlides.slideTo(0);
    } else if (this.currentSegment === 'reviews' && this.showReview) {
      this.ionSlides.slideTo(1);
    } else if (this.currentSegment === 'info' && !this.showReview) {
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
      } else if (index === 1 && this.showReview) {
        this.currentSegment = 'reviews';
      } else if (index === 1 && !this.showReview) {
        this.currentSegment = 'info';
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

  toggleFabButtonAndFooter(val) {
    this.logger.info(this, val, '----');
    this.logger.info(this, 'Hiding Fab Button');
    this.showCatgeoryFilterFab = val;
    this.showFooter = val;
  }


  checkPreorderStatus() {

    //Restaurant Should Be Closed
    // Preorder Should be Avialable
    // And Current Time should be between preorder[fromTime and toTime]
    const currentTime = new Date();
    this.isOrderAvailable = !this.closedPipe.transform(currentTime, this.store.openingTime, this.store.closingTime)
      && this.store.preOrderSettings.isPreOrderAvailable
      && this.closedPipe.transform(currentTime, this.store.preOrderSettings.fromTime, this.store.preOrderSettings.toTime);
  }

  checkClosedStatus() {
    const currentTime = new Date();
    this.isClosed = !this.closedPipe.transform(currentTime, this.store.openingTime, this.store.closingTime)
  }
}
