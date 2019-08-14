import { FilterService , FILTER_TYPES } from './../../services/filter.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input() showFilters = false;

  @Output() closeFilter = new EventEmitter();

  filterTypes = FILTER_TYPES;

  categories = [];

  constructor(
    private filter: FilterService,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {

  }

  closeEvent() {
    this.closeFilter.emit();
  }

  setFilterType(type) {

      this.filter.setFilter(type); 
  }

  // Api Does not Work
  // getCategories() {
  //   this.queryResource.findStoreAndCountUsingGET({}).subscribe(data => {
  //     if (data !== undefined) {

  //       this.categories = data;
  //     }
  //   });
  // }

}
