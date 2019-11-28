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

  cusines = ['Burger' , 'Pizza' , 'Biriyani']

  categories = [];

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

  // Api Does not Work
  // getCategories() {
  //   this.queryResource.findStoreAndCountUsingGET({}).subscribe(data => {
  //     if (data !== undefined) {

  //       this.categories = data;
  //     }
  //   });
  // }

  ngOnDestroy(): void {
    this.filterServiceSubscription.unsubscribe();
  }


}
