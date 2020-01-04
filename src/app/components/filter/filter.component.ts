import { FilterService , FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { NGXLogger } from 'ngx-logger';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit , OnDestroy {

  @Input() showFilters = true;

  @Output() closeFilter = new EventEmitter();

  @Input() showClose = true;

  filterTypes = FILTER_TYPES;

  cusines = [];

  deliveryType = 'Both';

  currentFilterType: FILTER_TYPES = FILTER_TYPES.NO_FILTER;

  filterServiceSubscription;

  type='sort';

  storageData;

  constructor(
    private filter: FilterService,
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private sharedData: SharedDataService,
    private util: Util
  ) { }

  ngOnInit() {
    this.logger.info("Setting Filter ");
    this.filterServiceSubscription = this.filter.getFilterSubscription()
    .subscribe(data => {
      if(data) {
        this.currentFilterType = data;
      }
    });
    this.getCusines();
  }

  saveDataToStrorage() {
    this.storageData = {
      type: this.type,
      cusines: (this.type==='cusine')?this.cusines.filter(c => c.checked):[],
      currentFilterType: this.currentFilterType
    }
    this.sharedData.saveToStorage('filter',this.storageData)
  }

  getSavedDataFromStorage() {
    this.sharedData.getData('filter')
    .then(data => {
      if(data != null){
        this.storageData = data;
        this.type = data.type;
        this.setFilterCategoryType(this.type);
        if(data.cusines.length !== 0) {
          this.cusines.forEach((c,i) => {
            const temp = data.cusines.filter(sc=>sc.key === c.key);
            if(temp.length > 0) {
              this.cusines[i]['checked']=true;
            }
          });
        }
        this.currentFilterType = data.currentFilterType; 
      } else {
        this.closeFilter.emit();
      }
    })
  }

  closeEvent() {
    this.closeFilter.emit('close');
  }

  clearFiter() {
    this.filter.setCurrentFilter(FILTER_TYPES.DISTANCE_WISE);
    this.closeEvent();
    this.sharedData.deleteData('filter');
  }

  setFilterCategoryType(type) {
    this.type = type;
    if(type==='cusine') {
      this.currentFilterType = FILTER_TYPES.CUSINE_FILTER;
    } else {
      if(this.storageData)
      this.currentFilterType = this.storageData.currentFilterType;
    }
  }

  setFilterType() {
    this.saveDataToStrorage();

    const cusineArray = [];
    this.cusines.filter(c=>c.checked)
    .forEach(cc => {
      cusineArray.push(cc.key);
    })  
    if(this.type==='cusine') {
      if(cusineArray.length !== 0) {

        this.logger.info('Selected Cusines',cusineArray , this.cusines);
        this.filter.setSelectedCusines(cusineArray);  
        this.filter.setCurrentFilter(this.currentFilterType);
      } else {
        this.util.createToast('Select Cusines or Any Other Filter')
      }
    } else {
      this.cusines.forEach(c => {
        c.checked = false;
      });
      this.filter.setCurrentFilter(this.currentFilterType);
    }
   
    this.closeEvent();
  }

  getCusines() {
    this.queryResource.findStoreTypeAndCountUsingGET({}).subscribe(data => {
      if (data !== undefined) {
        this.logger.info("Fetched Cusines" , data);
        this.cusines = data;
        this.getSavedDataFromStorage();
      }
    });
  }

  ngOnDestroy(): void {
    this.filterServiceSubscription.unsubscribe();
  }


}
