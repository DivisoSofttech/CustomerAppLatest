import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OpenTask } from 'src/app/api/models';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit , OnDestroy {
  @Input() task: OpenTask;

  store;

  order;

  orderSubscription;
  storesSubscription;

  constructor(
    private queryResource: QueryResourceService
  ) {}

  ngOnInit() {
    this.getOrder();
  }

  getOrder() {
    this.orderSubscription = this.queryResource
      .findOrderByOrderIdUsingGET(this.task.orderId)
      .subscribe(data => {
        this.order = data;
        if (data !== null) {
          this.getStore();
        }
      });
  }

  getStore() {
    this.storesSubscription = this.queryResource
      .findStoreByRegisterNumberUsingGET(this.order.storeId)
      .subscribe(data => {
        this.store = data;
      });
  }

  ngOnDestroy() {
    if (this.orderSubscription !== undefined && this.storesSubscription !== undefined) {
    this.orderSubscription.unsubscribe();
    this.storesSubscription.unsubscribe();
    }
  }


}
