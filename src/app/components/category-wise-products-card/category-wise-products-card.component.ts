import { PageOfStockCurrent } from './../../api/models/page-of-stock-current';
import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { LogService } from 'src/app/services/log.service';
import { StockCurrent } from 'src/app/api/models';

@Component({
  selector: 'app-category-wise-products-card',
  templateUrl: './category-wise-products-card.component.html',
  styleUrls: ['./category-wise-products-card.component.scss'],
})
export class CategoryWiseProductsCardComponent implements OnInit {

  @Input() category;

  @Input() store;

  @Input() highlightProductId;

  stockCurrents: StockCurrent[] = [];

  showLoading = true;

  @Input() isGuest = false;
  @Input() showData = false;

  firstToggle = false;

  constructor(
    private logger: LogService,
    private queryResource: QueryResourceService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(this.firstToggle === false && this.showData) {
      this.logger.info(this,'Fetching Products Via Category' , this.category.name);
      this.getProductsCategoryWise();
      this.firstToggle = true;
    } else {
      this.showLoading = false;
    }
  }
  
  getProductsCategoryWise() {
    this.showLoading = true;
    this.queryResource.findStockCurrentByStoreIdAndCategoryIdUsingGET({
      userId: this.store.regNo,
      categoryId: this.category.id
    })
    .subscribe(s => {
      s.forEach(stockCurrent=> {
        if(stockCurrent.id == this.highlightProductId) {
          this.stockCurrents.unshift(stockCurrent);
        } else {
          this.stockCurrents.push(stockCurrent);
        }
      })
      this.showLoading = false;
    });
  }

}
