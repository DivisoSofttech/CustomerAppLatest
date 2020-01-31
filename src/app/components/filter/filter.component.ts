import { FilterService , FILTER_TYPES , FILTER_KEY, ResultBucketModel, FilterModel } from './../../services/filter.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Util } from 'src/app/services/util';
import { ResultBucket } from 'src/app/api/models';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit , OnDestroy {

  cusines: ResultBucketModel[] = [];

  TEMP_FILTER_TYPES = FILTER_TYPES;

  filterCategory: string = 'sort';

  filterModel: FilterModel = {
    currentFilterType: FILTER_TYPES.DISTANCE_WISE,
    cusines:[],
  };

  filterServiceSubscription;

  @Output() public closeFilter = new EventEmitter();
  @Input() public showFilters = true;
  @Input() public showClose = true;

  constructor(
    private filterService: FilterService,
    private queryResource: QueryResourceService,
    private logger: LogService,
    private sharedData: SharedDataService,
    private util: Util
  ) { }

  ngOnInit() {
    this.fetchCusines();
  }

  getFilterSubscription() {
    this.filterServiceSubscription = this.filterService.getFilterSubscription()
    .subscribe(data => {
      if(data) {
        this.filterModel = data;
        this.cusines.forEach(c => {
          const tempCusines = this.filterModel.cusines.filter(stc=>stc.key === c.key)
          if(tempCusines.length > 0 && tempCusines[0].checked) {
            c.checked = true;
          }
        })
      }
    });  
  }

  saveFilterDetailsToStorage() {
    this.filterModel.cusines = (this.filterCategory==='cusine')?this.cusines.filter(c => c.checked):[],
    this.sharedData.saveToStorage(FILTER_KEY,this.filterModel)
  }

  resetFilter() {
    console.error('dkjdjkdjd');
    this.filterService.setCurrentFilter(FILTER_TYPES.DISTANCE_WISE);
    this.sharedData.deleteData(FILTER_KEY);
    this.closeEvent();
  }

  setFilterCategoryType(filterCategory) {
    this.filterCategory = filterCategory;
    if(this.filterCategory === 'cusine') {
      this.filterModel.currentFilterType = FILTER_TYPES.CUSINE_FILTER
    }
  }

  applyFilter() {
    this.saveFilterDetailsToStorage();
    const tempCusines = this.cusines.filter(c=>c.checked);
    if(this.filterCategory==='cusine') {
      if(this.cusines.length !== 0) {
        this.logger.info(this,'Selected Cusines',tempCusines);
        this.filterService.setSelectedCusines(tempCusines);  
        this.filterService.setCurrentFilter(this.filterModel.currentFilterType);
      } else {
        this.util.createToast('Select Cusines or Any Other Filter')
      }
    } else {
      this.cusines.forEach(c => {
        c.checked = false;
      });
      this.filterService.setCurrentFilter(this.filterModel.currentFilterType);
    }
    this.closeEvent();
  }

  fetchCusines() {
    this.queryResource.findStoreTypeAndCountUsingGET({}).subscribe(data => {
      if (data !== undefined) {
        this.logger.info(this,"Fetched Cusines" , data);
         data.map(a=>{
          a['checked'] = false;
          this.cusines.push(this.toResultBucketModel(a));
        });
        this.getFilterSubscription();
      }
    });
  }

  ngOnDestroy(): void {
    this.filterServiceSubscription?this.filterServiceSubscription.unsubscribe():0;
  }

  closeEvent() {
    this.closeFilter.emit('close');
  }

  toResultBucketModel(resultBucket: ResultBucket): ResultBucketModel {
    return Object.assign(resultBucket, {
        checked: false
    });
}


}
