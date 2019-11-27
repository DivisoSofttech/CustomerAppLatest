import { PageOfStockCurrent } from './../../api/models/page-of-stock-current';
import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-category-wise-products-card',
  templateUrl: './category-wise-products-card.component.html',
  styleUrls: ['./category-wise-products-card.component.scss'],
})
export class CategoryWiseProductsCardComponent implements OnInit {

  @Input() category;

  @Input() store;

  stockCurrents  = [];

  showLoading = true;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
    this.getProductsCategoryWise(0);
  }

  getProductsCategoryWise(i) {
    this.queryResource.findStockCurrentByStoreIdAndCategoryIdUsingGET({
      userId: this.store.regNo,
      categoryId: this.category.id,
      page: i
    })
    .subscribe(s => {
      if(i < s.totalPages)
      {
        i++;
        this.getProductsCategoryWise(i);
        this.stockCurrents.push(s.content);
      }
    });
  }

}
