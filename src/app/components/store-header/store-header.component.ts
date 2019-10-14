import { Util } from './../../services/util';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { StockCurrent } from 'src/app/api/models';
import { IonInfiniteScroll, IonSearchbar } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent implements OnInit {

  @Input() name = '';

  @Output() searchEnable = new EventEmitter();

  showSearchBar = false;

  showLoading = false;

  showSearchPane = false;

  stockCurrents: StockCurrent[] = [];

  searchTerm = '';

  pageCount = 0;

  @Input() storeId;

  @Input() store;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar , null) searchBar: IonSearchbar;

  constructor(
    private queryResource: QueryResourceService,
    private util: Util,
    private logger: NGXLogger,
  ) {}

  ngOnInit() {}

  toggleSearchBar() {
    this.logger.info('Hiding SearchBar and Emitting Event');
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    this.searchEnable.emit(!this.showSearchBar);
    if(this.showSearchBar) {
      this.searchBar.setFocus();
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  getProductsByName(i) {
    if(this.searchTerm !== '') {
      this.showLoading = true;
      this.queryResource
        .findStockCurrentByProductNameAndStoreIdUsingGET({
          name: this.searchTerm,
          storeId: this.storeId,
          page: i
        })
        .subscribe(data => {
          this.showLoading = false;
          if (data.content.length === 0) {
            // this.util.createToast('Sorry, couldn\'t find any match');
            return;
          } else {
            ++i;
            this.logger.info('Found products For ' , this.searchTerm , data.content , 'page ' , i);
            if (i === data.totalPages) {
              this.toggleInfiniteScroll();
            }
            data.content.forEach(s => {
              this.stockCurrents.push(s);
            });
          }
        }, err => {
          this.showLoading = false;
        });
    } else {
      this.showLoading = false;
    }
 
  }

  searchProducts(event) {
    this.searchTerm = event.detail.value;
    this.stockCurrents = [];
    this.showLoading = true;
    this.getProductsByName(0);
  }

  loadMoreData() {
    this.pageCount++;
    this.getProductsByName(this.pageCount);
  }
}
