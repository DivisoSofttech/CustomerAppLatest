
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { StockCurrent } from 'src/app/api/models';
import { IonInfiniteScroll, IonSearchbar, Platform } from '@ionic/angular';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent implements OnInit {

  @Input() name = '';

  @Output() categoryfilterClicked = new EventEmitter();

  @Output() searchEnable = new EventEmitter();

  showSearchBar = false;

  showLoading = false;

  showSearchPane = false;

  stockCurrents: StockCurrent[] = [];

  searchTerm = '';

  pageCount = 0;

  recents = [];

  @Input() storeId;

  @Input() store;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar, null) searchBar: IonSearchbar;
  backButtonSubscription: any;

  constructor(
    private queryResource: QueryResourceService,
    private platform: Platform,
    private logger: LogService,
    private recentService: RecentService
  ) { }

  ngOnInit() {
    this.toggleInfiniteScroll(true);
    this.getRecents();
    this.backButtonHandler();
  }

  ngOnDestroy(): void {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
  }

  backButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.showSearchBar) {
        this.showSearchBar = false;
      }
    });
  }


  getRecents() {
    this.logger.info(this, "Fetching Recents From Storage");
    this.recentService.getRecentProductSearchTerms()
      .subscribe(data => {
        if (data !== null) {
          this.recents = data;
        }
      })
  }

  selectSerachTerm(searchTerm) {
    this.searchBar.value = searchTerm;
  }

  toggleSearchBar() {
    this.logger.info('Hiding SearchBar and Emitting Event');
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    this.searchEnable.emit(!this.showSearchBar);
    if (this.showSearchBar) {
      this.searchBar.setFocus();
    } else {
      this.stockCurrents = [];
      this.searchTerm = '';
    }
  }

  toggleInfiniteScroll(value) {
    this.infiniteScroll.disabled = value;
  }

  getProductsByName(i) {
    if (this.searchTerm !== '') {
      this.showLoading = true;
      this.queryResource
        .findStockCurrentByProductNameAndStoreIdUsingGET({
          name: this.searchTerm,
          storeId: this.storeId,
          page: i
        })
        .subscribe(data => {
          this.showLoading = false;
          if (data.content.length !== 0) {
            data.content.forEach(s => {
              this.stockCurrents.push(s);
            });
          }
          ++i;
          this.logger.info('Found products For ', this.searchTerm, data.content, 'page ', i);
          if (i === data.totalPages || data.totalPages === 0) {
            this.toggleInfiniteScroll(true);
          } else {
            this.getProductsByName(i);
          }
        }, err => {
          this.showLoading = false;
        });
    } else {
      this.showLoading = false;
    }

  }


  searchProducts(event) {
    if (this.searchTerm.replace(/\s/g, '').length) {
      this.stockCurrents = [];
      this.showLoading = true;
      const found = this.recents.some(el => el.data === this.searchTerm);
      if (!found) {
        this.recentService.saveRecent({ data: this.searchTerm, type: RecentType.PRODUCT })
      }
      this.getProductsByName(0);
    }
  }

  emitFilterClick() {
    this.categoryfilterClicked.emit(null);
  }

  loadMoreData() {
    this.pageCount++;
    this.getProductsByName(this.pageCount);
  }
}
