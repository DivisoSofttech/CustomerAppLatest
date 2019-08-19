import { Component, OnInit, Input } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order } from 'src/app/api/models';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {

  orders: Order[] = [];

  stores = {};

  @Input() keyCloakUser;

  pageNumber = 0;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.getOrders(0);
  }

  getOrders(i) {
    this.queryResource.findOrdersByCustomerIdUsingGET({
      customerId: this.keyCloakUser.preferred_username,
      page: i,
    })
    .subscribe(porders => {
      porders.content.forEach(o => {
        this.orders.push(o);
        if(this.stores[o.storeId] === undefined) {
          this.getStores(o.storeId);
        }
      });
      ++i;
      if (i === porders.totalPages) {
        this.toggleInfiniteScroll();
      }
    });
  }

  getStores(id) {
    this.stores[id] = {};
    this.queryResource.findStoreByRegisterNumberUsingGET(id)
    .subscribe(store => {
      this.logger.info('Store ' , store);
      this.stores[id] = store;
    });
  }

  toggleInfiniteScroll() {

  }

  loadMoreData(event) {
    ++this.pageNumber;
    this.getOrders(this.pageNumber);
  }

  refresh(event) {

  }

}
