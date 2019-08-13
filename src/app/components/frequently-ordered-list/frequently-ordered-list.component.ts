import { Component, OnInit, Input } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order } from 'src/app/api/models';

@Component({
  selector: 'app-frequently-ordered-list',
  templateUrl: './frequently-ordered-list.component.html',
  styleUrls: ['./frequently-ordered-list.component.scss'],
})
export class FrequentlyOrderedListComponent implements OnInit {

  frequentOrders: Order[] = [];

  @Input() keyCloakUser;

  pageNumber = 0;

  constructor(
    private queryResource: QueryResourceService
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
        this.frequentOrders.push(o);
      });
      ++i;
      if (i === porders.totalPages) {
        this.toggleInfiniteScroll();
      }
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
