import { FilterService , FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit , OnDestroy {

  @Input() showFilters = false;

  @Output() closeFilter = new EventEmitter();

  @Input() showClose = true;

  filterTypes = FILTER_TYPES;

  cusines = [];

  deliveryType = 'Both';

  currentFilterType: FILTER_TYPES = FILTER_TYPES.NO_FILTER;

  filterServiceSubscription;

  type='cusine';

  constructor(
    private filter: FilterService,
    private queryResource: QueryResourceService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.filterServiceSubscription = this.filter.getSubscription()
    .subscribe(data => {
      this.currentFilterType = data;
    });
    this.getCusines();
  }

  closeEvent() {
    this.closeFilter.emit('close');
  }

  clearFiter() {
    this.filter.setFilter(FILTER_TYPES.DISTANCE_WISE);
    this.closeEvent();
  }

  setFilterCategoryType(type) {
    this.type = type;
    if(type==='cusine') {
      this.currentFilterType = FILTER_TYPES.CUSINE_FILTER;
    }  
  }

  setFilterType() {
    const cusineArray = [];
    this.cusines.filter(c=>c.checked)
    .forEach(cc => {
      cusineArray.push(cc.key);
    })
    this.logger.info('Selected Cusines',cusineArray , this.cusines);
    this.filter.setSelectedCusines(cusineArray);
    console.log(this.currentFilterType);
    this.filter.setFilter(this.currentFilterType);
    this.closeEvent();
  }

  getCusines() {
    this.queryResource.findStoreTypeAndCountUsingGET({}).subscribe(data => {
      if (data !== undefined) {
        this.logger.info("Fetched Categories" , data);
        if(data) {
          this.cusines = data;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.filterServiceSubscription.unsubscribe();
  }


}
