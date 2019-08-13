import { Util } from './../../services/util';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StockCurrent } from 'src/app/api/models';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent implements OnInit {
  @Input() name = '';

  showSearchBar = false;

  stockCurrents: StockCurrent[] = [];

  searchTerm = '';

  pageCount = 0;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;

  constructor(
    private queryResource: QueryResourceService,
    private util: Util
  ) {}

  ngOnInit() {}

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  getProductsByName(i) {
    this.queryResource
      .findStockCurrentByProductNameUsingGET({
        name: this.searchTerm,
        page: i
      })
      .subscribe(data => {
        console.log(data);
        if (data.content.length === 0) {
          this.util.createToast('Sorry, couldn\'t find any match');
          return;
        } else {
          ++i;
          if (i === data.totalPages) {
            this.toggleInfiniteScroll();
          }
          data.content.forEach(s => {
            this.stockCurrents.push(s);
          });
        }
      });
  }

  searchProducts(event) {
    this.searchTerm = event.detail.value;
    this.stockCurrents = [];
    this.getProductsByName(0);
  }

  loadMoreData() {
    this.pageCount++;
    this.getProductsByName(this.pageCount);
  }
}
