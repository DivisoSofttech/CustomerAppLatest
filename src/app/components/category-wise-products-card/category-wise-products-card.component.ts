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

  stockCurrents = [];

  showLoading = true;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
    this.getProductsCategoryWise();
  }

  getProductsCategoryWise() {
    this.queryResource.findStockCurrentByStoreIdAndCategoryIdUsingGET({
      userId: this.store.regNo,
      categoryId: this.category.id
    })
    .subscribe(s => {
      this.stockCurrents = s;
      this.showLoading = false;
    });
 
  }

}
