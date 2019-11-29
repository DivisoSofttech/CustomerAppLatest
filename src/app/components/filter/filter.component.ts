import { FilterService , FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit , OnDestroy {

  @Input() showFilters = false;

  @Output() closeFilter = new EventEmitter();

  filterTypes = FILTER_TYPES;

  cusines;

  deliveryType = 'Both';

  currentFilterType: FILTER_TYPES = FILTER_TYPES.NO_FILTER;

  filterServiceSubscription;

  type='sort';

  constructor(
    private filter: FilterService,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
    this.filterServiceSubscription = this.filter.getSubscription()
    .subscribe(data => {
      this.currentFilterType = data;
    });
    this.getCategories();
  }

  closeEvent() {
    this.closeFilter.emit('close');
  }

  clearFiter(filter) {
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    this.closeEvent();
  }

  setFilterCategoryType(type) {
    this.type = type;
  }

  setFilterType() {
    this.filter.setFilter(this.currentFilterType);
    this.closeEvent();
  }

  getCategories() {
    this.queryResource.findStoreTypeAndCountUsingGET({}).subscribe(data => {
      if (data !== undefined) {
        this.cusines = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.filterServiceSubscription.unsubscribe();
  }


}
